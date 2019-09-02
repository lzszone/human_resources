import {createContext} from 'react';

const RouterContext = createContext({
    redirect(path: string) {}
});

export default RouterContext;