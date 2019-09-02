import React from 'react';
import { Redirect, Route, Switch, RouteComponentProps } from 'react-router-dom';

import Feedback from './feedback';
import Profile from './profile';
import Mobile from './mobile';
import Password from './password';


export default function Settings(props: RouteComponentProps) {
    const { match: { path } } = props;

    return <Switch>
        <Route path={`${path}/`} exact render={() => <Redirect to={`${path}/profile`} />} />
        <Route path={`${path}/feedback`} component={Feedback} />
        <Route path={`${path}/profile`} component={Profile} />
        <Route path={`${path}/mobile`} component={Mobile} />
        <Route path={`${path}/password`} component={Password} />
    </Switch>
}