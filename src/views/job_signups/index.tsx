import React, { PropsWithChildren } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import qs from 'qs';
import styled from 'styled-components/macro';

import useStaticApi from '../../hooks/use_api';
import api from '../../services/api';
import useTitle from '../../hooks/use_title';
import { JobSignupHistoryStatusEnum, ListQueryParam, JobSignupHistory } from '../../services/api';
import renderPage from '../../components/render_page';

const tagMap = {
    [JobSignupHistoryStatusEnum.all]: '全部',
    [JobSignupHistoryStatusEnum.passed]: '已通过',
    [JobSignupHistoryStatusEnum.rejected]: '未通过'
};

const Tag = styled(Link)<{ selected: boolean }>`
    border-bottom: ${({selected}) => selected? (3 / 14).toString() + 'rem solid #007AFF': 'none'};
    color: ${props => props.selected ? '#007AFF' : '#666666'};
    text-decoration: none;
    padding-bottom: ${10 / 14}rem;
`;

const Card = styled.div`
    background-color: white;
    margin: ${7 / 14}rem ${8 / 14}rem;
    padding: ${8 / 14}rem;
    border: 1px solid rgba(238,238,238,1);
    border-radius: ${8 / 14}rem;
`;

const Title = styled.div`
    font-weight: bold;
    color: #333333;
    font-size: 1rem;
    line-height: ${20 / 14}rem;
`;

const Content = styled.div`
    color: #666666;
    font-size: ${12 / 14}rem;
    line-height: ${17 / 14}rem;
    margin: ${5 / 14}rem ${1 / 14}rem;
`;

const Day = styled(Content)`
    font-weight: bold;
`;

const S = styled.span`
    font-weight: bold;
    font-size: ${16 / 14}rem;
    line-height: ${22 / 14}rem;
`;

const Wrapper = styled.div`
    height: ${22 / 14}rem;
    display: flex;
    justify-content: space-between;
`;

const statusMap = {
    [JobSignupHistoryStatusEnum.all]: '全部',
    [JobSignupHistoryStatusEnum.processing]: '审核中',
    [JobSignupHistoryStatusEnum.passed]: '已通过',
    [JobSignupHistoryStatusEnum.rejected]: '未通过'
};

const colorMap = {
    [JobSignupHistoryStatusEnum.processing]: '#4A90E2',
    [JobSignupHistoryStatusEnum.passed]: '#259915',
    [JobSignupHistoryStatusEnum.rejected]: '#B80000'
};

function Status (props: {children: number}) {
    return <S style={{color: colorMap[props.children]}} >{statusMap[props.children]}</S>
}

function Signup(props: JobSignupHistory) {
    const { recruitTitle, rejectContent, createTime, status } = props;
    return <Card>
        <Title>{recruitTitle}</Title>
        <Content>{rejectContent}</Content>
        <Wrapper>
            <Day>{createTime}</Day>
            <Status>{status}</Status>
        </Wrapper>
    </Card>
}

const Board = styled.div`
    background: rgba(250,250,250,0.9);
    box-shadow: 0px 1px 0px 0px rgba(0,0,0,0.25);
    margin-bottom: ${7 / 14}rem;
`;

const W33 = styled.span<{selected: boolean}>`
    display: inline-block;
    vertical-align: middle;
    width: 33.3%;
    height: 100%;
    padding: ${11 / 14}rem 0 ${12 / 14}rem 0;
    color: ${({selected}) => selected? '#007AFF': '#666666'};
    font-size: ${16 / 14}rem;
    font-weight: bold;
    line-height: ${22 / 14}rem;
    text-align: center;
`;

export default function JobSignup(props: RouteComponentProps) {
    const { location, match, history } = props;
    const { pageNum, pageSize, status } = qs.parse(location.search.replace('?', '')) as ListQueryParam<{ status: JobSignupHistoryStatusEnum }>;
    const { data, error, isLoading } = useStaticApi(api.customer.jobSignupHistory.list, pageSize, pageNum, status);
    useTitle('报名记录');
    return renderPage(error, isLoading, data, (data) => <div>
        <Board>
            {Object.entries(tagMap).map(([s, t]) =>
                <W33 selected={Number(s) == status} >
                    <Tag
                        to={`${location.pathname}?${qs.stringify({ status: s })}`}
                        selected={Number(s) == status}
                        key={s}
                    >
                        {t}
                    </Tag>
                </W33>
            )}
        </Board>
        <div>
            {data.list.map(d => <Signup {...d} key={d.id} />)}
        </div>
    </div>)
}