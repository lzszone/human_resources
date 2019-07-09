import React from 'react';
import {Route, RouteComponentProps, Link} from 'react-router-dom';

import useApi from '../../hooks/use_api';
import useTitle from '../../hooks/use_title';
import api, {RecruitParam} from '../../api';

export default function Recruit(props: RouteComponentProps) {
    const {location, match} = props;
    const {data, error, isLoading} = useApi(api.recruit.list, {});
    useTitle('人才市场');
    if(isLoading) {
        return <div>Loading...</div>
    }
    if(error) {
        return <div style={{color: 'red'}}>
            {JSON.stringify(error)}
        </div>
    }
    return <div>
        <div>
            {JSON.stringify(match)}
        </div>
        <div>
            {JSON.stringify(location)}
        </div>
        {data.list.map(r => <div><Link key={r.id} to={`${match.path}/${r.id}`} >{r.title}</Link></div>)}
    </div>
};