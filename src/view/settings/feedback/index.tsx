import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Feedback from './feedback';
import List from './list';
import useTitle from '../../../hooks/use_title';

export default function Fb() {
    useTitle('意见反馈');
    return <Switch>
        <Route path='/' exact component={Feedback} />
        <Route path='/recruits' component={List} />
    </Switch>
}