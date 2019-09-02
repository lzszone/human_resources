import React from 'react';
import { RouteComponentProps } from 'react-router';

import useApi from '../../hooks/use_api';
import api from '../../services/api';
import renderPage from '../../components/render_page';

export default function Detail(props: RouteComponentProps<{ id: string }>) {
    const { error, data, isLoading } = useApi(api.recruit.detail, Number(props.match.params.id));
    console.log(data);

    return renderPage(error, isLoading, data, data => <div>
        <div>{data.title}</div>
        <div>{data.companyJobName}</div>
        <div>{data.companyName}</div>
        <div dangerouslySetInnerHTML={{ __html: data.recruitContent }}></div>
    </div>)
}