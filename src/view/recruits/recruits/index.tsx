import React, {useState} from 'react';
import {Route, RouteComponentProps, Link, Redirect} from 'react-router-dom';
import qs from 'qs';

import useApi from '../../../hooks/use_api';
import useTitle from '../../../hooks/use_title';
import {useSearch} from '../../../hooks/use_location';
import api, {RecruitParam} from '../../../api';

export default function Recruit(props: RouteComponentProps) {
    const {location, match} = props;
    const [searchState, setSearchState] = useSearch<RecruitParam>(location.search);
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const {data, error, isLoading} = useApi(api.recruit.list, searchState);
    useTitle('人才市场');
    if(shouldRedirect) {
        return <Redirect to={{pathname: location.pathname, search: qs.stringify(searchState)}} />
    }
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