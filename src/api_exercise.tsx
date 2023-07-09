import React, {MouseEvent, useState} from 'react';

import { root_url } from './env';

import { httpGet } from './util';

import { useQuery, useLazyQuery, useMutation, DocumentNode, gql as gqlClient } from '@apollo/client';

import { gql } from './__generated__/gql';

function restGet(event: MouseEvent<HTMLButtonElement>) {
    console.log("clicked button");
    console.log(root_url);

    let res = httpGet(root_url+"/hello");
    console.log(res);
}

const TEST_QUERY_STR = /* GraphQL */ `query myQuery {goodbye}`;

const ADD_TEXT_TODO_MUTATION_STR = /* GraphQL */ `
  mutation AddTodo($text: String!) {
    createTodo(text: $text) {
        todo {
          text
          id
        }
    }
  }
`;

const GqlMutationInput: React.FC = () => {
    const [todo_text, set_todo_text] = useState('');

    const add_todo_mutation : DocumentNode = gqlClient(ADD_TEXT_TODO_MUTATION_STR) as DocumentNode;
 
    const [add_todo, { data, loading, error }] = useMutation(add_todo_mutation, {
        refetchQueries: [
          'TextTodosQuery'
        ],
      });


    if (loading) return (<span>'Submitting...'</span>);
    if (error) return (<span>`Submission error! ${error.message}`</span>);

    const on_input_change = (event: React.ChangeEvent<HTMLInputElement>) => {
        set_todo_text(event.target.value);
    };

    const on_button_click = (event: MouseEvent<HTMLButtonElement>) => {
        console.log(todo_text);

        add_todo({ variables: { text: todo_text } });
        set_todo_text('');
    };

    return (<div>
        <input
            type="text"
            id="todo-text"
            name="todo-text"
            onChange={on_input_change}
            value={todo_text}
        />
        <button onClick={on_button_click}>Save</button>
    </div>);
};

const TEXT_TODOS_QUERY_STR = /* GraphQL */ `
query TextTodosQuery {
    todos {
        text
        id
      }
}
`;

const TextOnlyTodoList: React.FC = () => {
    const text_todos_query : DocumentNode = gql(TEXT_TODOS_QUERY_STR) as DocumentNode;
    const {loading, data} = useQuery(text_todos_query);

    if (loading) {
        return (<span>loading...</span>)
    }

    const todo_list_items = data.todos.map(
        // todo: get type inference out of gql schema if possible?
        (todo: {text: String, id: number}) => (<li key={todo.id}>{todo.text}</li>)
        );

    return (<ul>
        {todo_list_items}
    </ul>);
};

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
        <GqlMutationInput/>
        <TextOnlyTodoList/>
    </div>);
}

export default ApiExercise;

