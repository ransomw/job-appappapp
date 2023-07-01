import ReactDOM from 'react-dom/client';

import RootPlaceholder from "./root";

declare const BUILD_ENV : string | undefined;
console.log(BUILD_ENV);
let root_url = "";
if (BUILD_ENV == "dev") {
    root_url = "/api";
} else if (BUILD_ENV == "prod") {
    root_url = "";
} else {
    throw new Error("unknown build "+process.env.BUILD)
}
 
const root = ReactDOM.createRoot(
    document.getElementById('app') as HTMLElement
);
root.render(RootPlaceholder({}));
  

console.log("hello world");

const button = document.getElementById("download")! as HTMLButtonElement;

button.addEventListener('click', (event) => {
    console.log("clicked button");
    console.log(root_url);

    let res = httpGet(root_url+"/hello");
    console.log(res);
});

function httpGet(theUrl : string) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


