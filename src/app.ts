import ReactDOM from 'react-dom/client';

import RootPlaceholder from "./root";

import { root_url } from './env';

import { httpGet } from './util';

const root = ReactDOM.createRoot(
    document.getElementById('app') as HTMLElement
);
root.render(RootPlaceholder({}));

const button = document.getElementById("download")! as HTMLButtonElement;

button.addEventListener('click', (event) => {
    console.log("clicked button");
    console.log(root_url);

    let res = httpGet(root_url+"/hello");
    console.log(res);
});

