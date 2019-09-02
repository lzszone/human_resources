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

const Tag = styled(Link) <{ selected: boolean }>`
    color: ${props => props.selected ? '#007AFF' : '#666666'};
`;

const statusMap = {
    [JobSignupHistoryStatusEnum.all]: '全部',
    [JobSignupHistoryStatusEnum.processing]: '审核中',
    [JobSignupHistoryStatusEnum.passed]: '已通过',
    [JobSignupHistoryStatusEnum.rejected]: '未通过'
};

function Signup(props: JobSignupHistory) {
    const { recruitTitle, rejectContent, createTime, status } = props;
    return <div>
        <div>{recruitTitle}</div>
        <div>{rejectContent}</div>
        <div>
            <span>{createTime}</span>
            <span>{statusMap[status]}</span>
        </div>
    </div>
}

export default function JobSignup(props: RouteComponentProps) {
    const { location, match, history } = props;
    const { pageNum, pageSize, status } = qs.parse(location.search.replace('?', '')) as ListQueryParam<{ status: JobSignupHistoryStatusEnum }>;
    const { data, error, isLoading } = useStaticApi(api.customer.jobSignupHistory.list, pageSize, pageNum, status);
    useTitle('报名记录');

    return renderPage(error, isLoading, data, (data) => <div>
        <div>
            {Object.entries(tagMap).map(([s, t]) =>
                <Tag
                    to={`${location.pathname}?${qs.stringify({ status: s })}`}
                    selected={Number(s) == status}
                    key={s}
                >
                    {t}
                </Tag>)
            }
        </div>
        <div>
            {data.list.map(d => <Signup {...d} key={d.id} />)}
        </div>
    </div>)
}