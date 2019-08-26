import React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';

import Feedback from './feedback';
import List from './list';

export default function Fb(props: RouteComponentProps) {
    const {match: { path }} = props;

    return <Switch>
        <Route path={`${path}/`} exact component={Feedback} />
        <Route path={`${path}/list`} component={List} />
    </Switch>
}