import React, {PropsWithChildren, ReactNode} from 'react';
import {BrowserRouter as Router, Route, RouteProps} from 'react-router-dom';

import RouterContext from '../contexts/router';

function RouterContextProviderGenerator(children: ReactNode) {
    return function RouterContextProvider(props: RouteProps) {
        return <RouterContext.Provider value={props}>
            {children}
        </RouterContext.Provider>
    }
}

export default function HookedRouter({children}: PropsWithChildren<{}>) {
    return <Router>
        <Route>
            {RouterContextProviderGenerator(children)}
        </Route>
    </Router>
};