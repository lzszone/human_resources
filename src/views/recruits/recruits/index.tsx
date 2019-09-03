import React, { useContext } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import qs from 'qs';

import useStaticApi from '../../../hooks/use_api';
import useTitle from '../../../hooks/use_title';
import RouterContext from '../../../contexts/router';
import api, { RecruitParam } from '../../../services/api';
import SearchSelect from './search_select';
import renderPage from '../../../components/render_page';

export default function Recruit(props: RouteComponentProps) {
    const { location, match, history } = props;
    const searchState = qs.parse(location.search.replace('?', '')) as RecruitParam;
    const { data, error, isLoading } = useStaticApi(api.recruit.list, searchState);
    const Router = useContext(RouterContext)
    const searchProps = useStaticApi(api.recruit.getSearchParams);
    useTitle('人才市场');
    function goto(args: RecruitParam) {
        Router.redirect(`${location.pathname}?${qs.stringify(args)}`)
    }
    return renderPage(error, isLoading, data, (data) => <div>
        <SearchSelect {...searchState} goto={goto} searchProps={searchProps} />
        {data.list.map(r => <div key={r.id}><Link to={`${match.path}/${r.id}`} >{r.title}</Link></div>)}
    </div>)
};