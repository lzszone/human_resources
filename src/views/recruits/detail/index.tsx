import React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';

import Signup from './signup';
import Detail from './detail';

export default function RecruitsRoute(props: RouteComponentProps) {
    const { match } = props;
    return <Switch>
        <Route path={`${match.path}`} exact component={Detail} />
        <Route path={`${match.path}/signup`} component={Signup} />
    </Switch>
}