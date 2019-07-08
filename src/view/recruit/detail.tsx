import React from 'react';

import useApi from '../../hooks/use_api';
import api from '../../api';
import {DetailProps} from '.';

export default function Detail(props: DetailProps) {
    const {error, data, isLoading} = useApi(api.recruit.detail, props.id);
    if(isLoading) {
        return <div>loading...</div>
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