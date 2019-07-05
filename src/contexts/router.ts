import {createContext} from 'react';
import {RouteProps} from 'react-router-dom';

const RouterContext = createContext({} as RouteProps);

export default RouterContext;
