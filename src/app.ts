import ReactDOM from 'react-dom/client';

import RootPlaceholder from "./root";


const root = ReactDOM.createRoot(
    document.getElementById('app') as HTMLElement
);
root.render(RootPlaceholder({}));
  

console.log("hello world");

const button = document.getElementById("download")! as HTMLButtonElement;

button.addEventListener('click', (event) => {
    console.log("clicked button");

    let res = httpGet('/api');
    console.log(res);
});

function httpGet(theUrl : string) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


