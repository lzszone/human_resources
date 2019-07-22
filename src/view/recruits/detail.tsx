import React from 'react';
import {RouteComponentProps} from 'react-router';

import useApi from '../../hooks/use_api';
import api from '../../service/api';
import Loading from '../../components/loading';

export default function Detail(props: RouteComponentProps<{id: string}>) {
    const {error, data, isLoading} = useApi(api.recruit.detail, Number(props.match.params.id));
    if(isLoading) {
        return <Loading/>
    }
    if(error) {
        return <div>{JSON.stringify(error)}</div>
    }
    return <div>
        <div>{data.title}</div>
        <div>{data.companyJobName}</div>
        <div>{data.companyName}</div>
        <div>{data.recruitContent}</div>
    </div>
}