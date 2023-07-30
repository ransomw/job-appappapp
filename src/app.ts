import ReactDOM from 'react-dom/client';

import RootPlaceholder from "./root";

import { root_url } from './env';

import { httpGet } from './util';

const root = ReactDOM.createRoot(
    document.getElementById('app') as HTMLElement
);
root.render(RootPlaceholder({}));
