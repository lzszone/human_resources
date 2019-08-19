import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import Recruit from './recruits';
import JobSignups from './job_signups';
import useTitle from '../hooks/use_title';
import Settings from './settings';

export default function Index() {
    return <Switch>
        <Route path='/' exact render={() => <Redirect to='/recruits' />} />
        <Route path='/recruits' component={Recruit} />
        <Route path='/job_signups' component={JobSignups} />
        <Route path='/settings' component={Settings} />
        <Route path='*' render={() => '404'} />
    </Switch>
}