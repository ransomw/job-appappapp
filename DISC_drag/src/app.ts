
interface Draggable {
    dragStartHandler(event: DragEvent) : void;
    dragEndHandler(event : DragEvent) : void;
}

interface DragTarget {
    dragOverHandler(event: DragEvent) : void;
    dropHandler(event: DragEvent) : void;
    dragLeaveHandler(event: DragEvent) : void;
}


const num_traits = 4;

type Rank = number;

class Trait {
    constructor(
        public id: string,
        public name: string,
        public rank: Rank,
        public is_decided: boolean,
    ) {
        
    }
}

function init_traits(): Trait[] {
    const trait_names = [
        "asdf",
        "qwer",
        "zxcv",
        "foo",
    ];
    if (trait_names.length !== num_traits) {
        throw new Error("programming error: wrong number of traits");
    }
    let curr_rank = 1;
    const traits: Trait[] = [];
    for (const name of trait_names) {
        traits.push(new Trait(
            Math.random().toString(),
            name,
            curr_rank as Rank,
            false,
        ))
        curr_rank += 1;
    }
    return traits;
}

type Listener<T> = (items : T[]) => void;

class State<T> {
    protected listeners : Listener<T>[] = [];

    constructor(protected items: T[]) {}

    addListener(listenerFn : Listener<T>) {
        this.listeners.push(listenerFn);
    }

    protected updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.items.slice());
        }
    }
}

class TraitState extends State<Trait> {
    private static instance : TraitState;

    private constructor() {
        super(init_traits());
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new TraitState();
        return this.instance;
    }

    rankTrait(id: string, rank: Rank) {
        const trait = this.items.find(trait => trait.id == id);
        if (trait) {
            trait.is_decided = true;
            trait.rank = rank;
            this.updateListeners();
        }
    }

    initRender() {
        this.updateListeners();
    }

}

const traitState = TraitState.getInstance();

function Autobind(target : any, methodName : string, descriptor : PropertyDescriptor) {
    const origMethod = descriptor.value;
    const adjDescriptor : PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = origMethod.bind(this);
            return boundFn;
        }
    }
    return adjDescriptor;
}


abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateEl : HTMLTemplateElement;
    hostEl : T;
    element : U;
    
    constructor(
        templateId : string,
        hostElId : string,
        newElementId? : string
    ) {
        this.templateEl = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostEl = document.getElementById(hostElId)! as T;

        const importedNode = document.importNode(
            this.templateEl.content, true
        );
        this.element = importedNode.firstElementChild as U;
        if (newElementId) {
            this.element.id = newElementId;   
        }
        this.attach();
    }

    private attach() {
        this.hostEl.insertAdjacentElement('afterbegin', this.element);        
    }

    abstract configure() : void;
    abstract renderContent() : void;
}

class TraitItem extends Component<HTMLUListElement, HTMLLIElement> 
implements Draggable{
    private trait : Trait;

    constructor(hostId: string, trait : Trait) {
        super('single-trait', hostId, trait.id);
        this.trait = trait;
        this.configure();
        this.renderContent();
    }

    @Autobind
    dragStartHandler(event: DragEvent) {
        event.dataTransfer!.setData('text/plain', this.trait.id);
        event.dataTransfer!.effectAllowed = 'move';
    }

    @Autobind
    dragEndHandler(event: DragEvent)  {
        event.preventDefault();
    }

    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler)
        this.element.addEventListener('dragend', this.dragEndHandler)
    }

    renderContent() {
        this.element.querySelector('h2')!.textContent = this.trait.name;      
    }
}

class BlankItem extends Component<HTMLUListElement, HTMLLIElement> 
implements DragTarget{

    constructor(hostId: string, public rank: Rank) {
        super('single-blank', hostId);

        this.configure();
    }


    @Autobind
    dragOverHandler(event: DragEvent) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            console.log("preparing to rank "+this.rank.toString())
        }
    }

    @Autobind
    dropHandler(event: DragEvent) {
        const id = event.dataTransfer!.getData('text/plain');
        traitState.rankTrait(
            id, 
            this.rank);
    }

    @Autobind
    dragLeaveHandler(event: DragEvent) {
        event.preventDefault();
    }

    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('drop', this.dropHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
    }

    renderContent() {}
}

class TraitList extends Component<HTMLDivElement, HTMLElement> {
    maybeTraits : (Trait|null)[];

    constructor(private type : 'decided' | 'undecided') {
        super('trait-list', 'app', `${type}-traits`);
        this.maybeTraits = [];
        
        this.configure();
        this.renderContent();
    }


    configure() {
        traitState.addListener((traits: Trait[]) => {
            const relevant_traits = traits.filter(trait => {
                if (this.type === 'decided') {
                    return trait.is_decided;
                }
                return !trait.is_decided;
            } );
            relevant_traits.sort((a, b) => a.rank as number - b.rank as number);
            const trait_map: {[rank: number]: Trait} = {};
            relevant_traits.forEach((trait) => {
                trait_map[trait.rank] = trait;
            })
            this.maybeTraits = [];
            for(let i = 1; i <= num_traits; i++) {
                let to_push: (Trait|null);
                if (trait_map[i]) {
                    to_push = trait_map[i];
                } else {
                    to_push = null;
                }
                this.maybeTraits.push(to_push);
            }
            this.renderTraits();
        });        
    }

    renderContent() {
        const listId = `${this.type}-traits-list`;
        this.element.querySelector('ul')!.id = listId;
    }

    private renderTraits() {
        const listEl = document.getElementById(
            `${this.type}-traits-list`
        )! as HTMLUListElement;
        listEl.innerHTML = '';
        for (let i = 0; i < num_traits; i++) {
            let maybe_trait = this.maybeTraits[i]
            if (maybe_trait === null) {
                new BlankItem(
                    this.element.querySelector('ul')!.id,
                    i+1
                )
            } else {
                new TraitItem(
                    this.element.querySelector('ul')!.id,
                    maybe_trait,
                )
            }
        }
    }
}

const decided_list = new TraitList("decided");
const undecided_list = new TraitList("undecided");

traitState.initRender();