import React, {MouseEvent} from 'react';

import { root_url } from './env';

import { httpGet } from './util';

import { useQuery, useLazyQuery, DocumentNode } from '@apollo/client';

import { gql } from './__generated__/gql';

function restGet(event: MouseEvent<HTMLButtonElement>) {
    console.log("clicked button");
    console.log(root_url);

    let res = httpGet(root_url+"/hello");
    console.log(res);
}

const TEST_QUERY_STR = /* GraphQL */ `query myQuery {goodbye}`;


const ApiExercise: React.FC = () => {


    const test_query : DocumentNode = gql(TEST_QUERY_STR) as DocumentNode;
    const { loading, data } = useQuery(test_query);

    return (<div>
        <h2>api exercise</h2>
        <button onClick={restGet}>REST Get</button>
        <div>
            <h3>GQL query result</h3>
            {loading ? (<p>loading...</p>) :
            ( <p>{data && data.goodbye}</p>)}
        </div>
    </div>);
}

export default ApiExercise;

