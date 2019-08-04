import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import Recruit from './recruits';
import JobSignups from './job_signups';
import useTitle from '../hooks/use_title';

export default function Index() {
    useTitle('首页');
    return <Switch>
        <Route path='/' exact render={() => <Redirect to='/recruits' />} />
        <Route path='/recruits' component={Recruit} />
        <Route path='/job_signups' component={JobSignups} />
    </Switch>
}