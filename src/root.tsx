import React from 'react';

import { ApolloProvider } from '@apollo/client';

import ApiExercise from './api_exercise';
import { client } from './apollo_client';

const RootPlaceholder: React.FC = () => {
    return (<ApolloProvider client={client}> <div>
        <h1>React component!</h1>
        <ApiExercise/>
        </div>
        </ApolloProvider>);
}

export default RootPlaceholder;

