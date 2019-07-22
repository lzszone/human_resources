import React from 'react';
import {RouteComponentProps, Link} from 'react-router-dom';
import qs from 'qs';

import useApi from '../../../hooks/use_api';
import useTitle from '../../../hooks/use_title';
import api, {RecruitParam} from '../../../service/api';
import SearchSelect from './search_select';

export default function Recruit(props: RouteComponentProps) {
    const {location, match, history} = props;
    const searchState = qs.parse(location.search.replace('?', '')) as RecruitParam;
    const {data, error, isLoading} = useApi(api.recruit.list, searchState);
    const searchProps = useApi(api.recruit.getSearchParams);
    useTitle('人才市场');
    function goto(args: RecruitParam) {
        history.push(`${location.pathname}?${qs.stringify(args)}`)
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
        <SearchSelect {...searchState} goto={goto} searchProps={searchProps} />
        {data.list.map(r => <div><Link key={r.id} to={`${match.path}/${r.id}`} >{r.title}</Link></div>)}
    </div>
};