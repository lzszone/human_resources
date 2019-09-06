import React, { useContext, useState, HtmlHTMLAttributes } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import qs from 'qs';
import styled from 'styled-components/macro';

import useStaticApi, {usePaginationApi} from '../../../hooks/use_api';
import useTitle from '../../../hooks/use_title';
import RouterContext from '../../../contexts/router';
import api, { RecruitParam } from '../../../services/api';
import SearchSelect from './search_select';
import renderPage from '../../../components/render_page';
import ListView from '../../../components/list_view';
import searchIconSrc from '../../../../assets/search.png';
import filterActivatedSrc from '../../../../assets/filter-activated.png';
import filterSrc from '../../../../assets/filter.png';

const Input = styled.input`
    border: none;
    font-size: ${12 / 14}rem;
    margin-right: ${103 / 14}rem;
    margin-left: ${36 / 14}rem;
    line-height: ${15 / 14}rem;
    display: block;
    height: ${32 / 14}rem;
    border-top-right-radius: ${16 / 14}rem;
    border-bottom-right-radius: ${16 / 14}rem;
    width: fill-available;
`;

const SearchDiv = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: ${36 / 14}rem;
    height: ${32 / 14}rem;
    border-top-left-radius: ${16 / 14}rem;
    border-bottom-left-radius: ${16 / 14}rem;
    background-color: white;
`;

const SearchIcon = styled.img`
    margin: ${8 / 14}rem ${4 / 14}rem ${8 / 14}rem ${16 / 14}rem;
    width: ${16 / 14}rem;
`;

const ToolBar = styled.div`
    position: relative;
`;

const FilterDiv = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    width: ${103 / 14}rem;
    height: ${32 / 14}rem;
    display: flex;
    justify-content: space-around;
    color: #333333;
    font-weight: bold;
    cursor: pointer;
`;

const CitySelect = styled.select`
    background-color: inherit;
    border: none;
`;

const CityOption = styled.option``;

const FilterText = styled.div`
    display: inline-block;
    color: ${(props: {activated: boolean}) => props.activated? '#4A90E2': 'inherit'};
    vertical-align: middle;
`;

const FilterImg = styled.img`
    width: ${9 / 14}rem;
    height: ${10 / 14}rem;
    margin: ${5 / 14}rem ${2 / 14}rem;
    display: ${(props: {show: boolean}) => props.show? 'initial': 'none'};
    vertical-align: middle;
`;

const FilterContainer = styled.div`
    height: ${20 / 14}rem;
    margin: ${6 / 14}rem 0;
`;

function Filter (props: HtmlHTMLAttributes<HTMLDivElement> & {activated: boolean}) {
    const { activated, ...rest } = props;

    return <FilterContainer {...rest} >
        <FilterText activated={activated}>筛选</FilterText>
        <FilterImg src={filterActivatedSrc} show={activated} />
        <FilterImg src={filterSrc} show={!activated} />
    </FilterContainer>
}

export default function Recruit(props: RouteComponentProps) {
    const { location, match, history } = props;
    const searchState = qs.parse(location.search.replace('?', '')) as RecruitParam;
    const { data, error, isLoading, loadNext } = usePaginationApi(api.recruit.list, searchState);
    const [ filterVisibility, setFilterVisibility ] = useState(false);
    const Router = useContext(RouterContext);
    const searchProps = useStaticApi(api.recruit.getSearchParams);
    useTitle('人才市场');

    function goto(args: RecruitParam) {
        Router.redirect(`${location.pathname}?${qs.stringify(args)}`)
    }
    return renderPage(error, isLoading, data, (data) => <ListView onScrollToBottom={loadNext} >
        <ToolBar>
            <SearchDiv><SearchIcon src={searchIconSrc} /></SearchDiv>
            <Input placeholder='找找你心仪的工作~' />
            <FilterDiv>
                <CitySelect defaultValue='0' >
                    <CityOption value='0' >成都</CityOption>
                </CitySelect>
                <Filter activated={JSON.stringify(searchState) !== '{}'} onClick={() => setFilterVisibility(true)} />
            </FilterDiv>
        </ToolBar>
        <SearchSelect {...searchState} goto={goto} searchProps={searchProps} visible={filterVisibility} hide={() => setFilterVisibility(false)} />
        {data.list.map(r => <div key={r.id}><Link to={`${match.path}/${r.id}`} >{r.title}</Link></div>)}
    </ListView>)
};