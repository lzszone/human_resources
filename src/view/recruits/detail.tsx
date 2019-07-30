import React from 'react';
import {RouteComponentProps} from 'react-router';

import useApi from '../../hooks/use_api';
import api from '../../service/api';
import Loading from '../../components/loading';
import FetchingError from '../../components/fetching_error';

export default function Detail(props: RouteComponentProps<{id: string}>) {
    const {error, data, isLoading} = useApi(api.recruit.detail, Number(props.match.params.id));
    if(isLoading) {
        return <Loading/>
    }
    if(error) {
        return <FetchingError error={error} />
    }
    return <div>
        <div>{data.title}</div>
        <div>{data.companyJobName}</div>
        <div>{data.companyName}</div>
        <div>{data.recruitContent}</div>
    </div>
}