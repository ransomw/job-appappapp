import React from 'react';

import { ApolloProvider } from '@apollo/client';

import {ApiExercise, TextOnlyTodoList} from './api_exercise';
import { client } from './apollo_client';
import {
    createBrowserRouter,
    RouterProvider,
    Link,
    Outlet,
} from "react-router-dom";

const RouterRoot: React.FC = () => {
    return (
        <div>
<nav>
<ul>
    <li>
        <Link to={`/`}>home</Link>
    </li>
    <li>
        <Link to={`todo-list`}>Todo List</Link>
    </li>
    <li>
        <Link to={`api-exercise`}>API exercise</Link>
    </li>
</ul>
</nav>
        <div>
            <Outlet/>
        </div>
        </div>
    )
} 

const router = createBrowserRouter([
    {
        path: "/",
        element: <RouterRoot/>,
        children: [
            {
                index: true,
                element: <div>hello world!</div>
            },
            {
                path: "api-exercise",
                element: <ApiExercise/>,
            },
            {
                path: "todo-list",
                element: <TextOnlyTodoList/>,
            }
        ],
    },
])



const RootPlaceholder: React.FC = () => {
    return (<ApolloProvider client={client}> 
        <React.StrictMode>
        <div>
        <RouterProvider router={router} />
        </div>
        </React.StrictMode>
        </ApolloProvider>);
}

export default RootPlaceholder;

