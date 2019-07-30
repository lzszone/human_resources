import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import Recruit from './recruits';
import Profile from './profile';
import useTitle from '../hooks/use_title';

export default function Index() {
    useTitle('首页');
    return <Switch>
        <Route path='/' exact render={() => <Redirect to='/recruits' />} />
        <Route path='/recruits' component={Recruit} />
        <Route path='/profile' component={Profile} />
    </Switch>
}