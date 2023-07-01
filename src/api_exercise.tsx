import React, {MouseEvent} from 'react';

import { root_url } from './env';

import { httpGet } from './util';

function restGet(event: MouseEvent<HTMLButtonElement>) {
    console.log("clicked button");
    console.log(root_url);

    let res = httpGet(root_url+"/hello");
    console.log(res);
}

const ApiExercise: React.FC = () => {
    return (<div>
        <h2>api exercise</h2>
        <button onClick={restGet}>REST Get</button>
    </div>);
}

export default ApiExercise;

