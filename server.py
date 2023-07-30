import werkzeug
import flask
from flask import jsonify
from flask import render_template
import graphene
from graphql_server.flask.graphqlview import GraphQLView
from graphql.utilities import print_schema
import click

_todos = []
_next_todo_id = 0

class Todo(graphene.ObjectType):
    text = graphene.String()
    id = graphene.Int()

class CreateTodo(graphene.Mutation):
    class Arguments:
        text = graphene.String()

    todo = graphene.Field(lambda: Todo)

    def mutate(root, info, text):
        global _next_todo_id
        todo = Todo(text=text, id=_next_todo_id)
        _next_todo_id += 1
        _todos.append(todo)
        return CreateTodo(todo=todo)
    

class DeleteTodo(graphene.Mutation):
    class Arguments:
        id = graphene.Int()

    ok = graphene.Boolean()

    def mutate(root, info, id):
        global _todos
        if id not in [todo.id for todo in _todos]:
            # todo: is this the GQL way to pass exceptions?  try out in graphiql
            raise Exception("no todo with id "+str(id))
        _todos = [todo for todo in _todos if todo.id != id]
        return DeleteTodo(ok=True)


class TodoInput(graphene.InputObjectType):
    text = graphene.String(required=True)
    id = graphene.Int(required=True)


class UpdateTodo(graphene.Mutation):
    class Arguments:
        todo_data = TodoInput(required=True)

    todo = graphene.Field(Todo)

    def mutate(root, id, todo_data=None):
        todo = Todo(text=todo_data.text, id=todo_data.id)
        gen = (idx for idx, curr_todo in enumerate(_todos) if curr_todo.id == todo_data.id)
        todo_idx = next(gen)
        _todos[todo_idx].text = todo_data.text
        return UpdateTodo(todo=todo)
    

class MyMutations(graphene.ObjectType):
    create_todo = CreateTodo.Field()
    delete_todo = DeleteTodo.Field()
    update_todo = UpdateTodo.Field()

class Episode(graphene.Enum):
    NEWHOPE = 4
    EMPIRE = 5
    JEDI = 6


class Character(graphene.ObjectType):
    name = graphene.String()
    appears_in = graphene.NonNull(graphene.List(graphene.NonNull(graphene.String)))

    def resolve_name(parent, info):
        return parent['name']
    
    def resolve_appears_in(parent, info):
        return parent['appears_in']


HERO_R2D2 = {"name": "R2-D2", "appears_in": [
            "NEWHOPE",
            "EMPIRE",
            "JEDI",
        ]}
HERO_LUKE = {"name": "Luke Skywalker", "appears_in": [
            "NEWHOPE",
            "EMPIRE",
            "JEDI",   
]}

class Query(graphene.ObjectType):
    hello = graphene.String(first_name=graphene.String(default_value="stranger"))
    goodbye = graphene.String()

    hero = graphene.Field(Character, 
                           episode=graphene.Argument(Episode,
                                                    default_value=Episode.JEDI
                                                    ))

    todos = graphene.List(Todo)

    todo = graphene.Field(Todo, id=graphene.Argument(graphene.Int))

    def resolve_todos(root, info):
        return _todos
    
    def resolve_todo(root, info, id):
        gen = (todo for todo in _todos if todo.id == id)
        todo = next(gen)
        return todo

    def resolve_hero(root, info, 
                     episode
                     ):
        if episode == Episode.EMPIRE:
            return HERO_LUKE
        return HERO_R2D2

    # our Resolver method takes the GraphQL context (root, info) as well as
    # Argument (first_name) for the Field and returns data for the query Response
    def resolve_hello(root, info, first_name):
        return f'Hello {first_name}!'

    def resolve_goodbye(root, info):
        return 'See ya!'

schema = graphene.Schema(
    query=Query, 
    mutation=MyMutations
    )


app = flask.Flask(__name__, template_folder='srv_templates', static_folder='srv_static')

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/hello")
def hello_world():
    return jsonify({"message": "hello from flask"})

app.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True,
    )
)


@click.group()
def cli():
    pass

@cli.command()
def gql_schema():
    my_schema_str = print_schema(schema.graphql_schema)
    with open("schema.graphql", "w") as fp:
        fp.write(my_schema_str)
        fp.close()

@cli.command()
def run_app():
    werkzeug.serving.run_simple(
        "0.0.0.0",
        5000,
        app,
        use_debugger=True,
        use_reloader=True,
    )


if __name__ == '__main__':
    cli()
