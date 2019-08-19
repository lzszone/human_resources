import React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';

import Recruits from './recruits';
import Detail from './detail';

export default function RecruitsRoute(props: RouteComponentProps) {
    const { match } = props;
    return <Switch>
        <Route path={`${match.path}`} exact component={Recruits} />
        <Route path={`${match.path}/:id`} component={Detail} />
    </Switch>
}