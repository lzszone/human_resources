import React, {useState} from 'react';
import {RouteComponentProps} from 'react-router';

import useTitle from '../../hooks/use_title';
import api, {CustomerProfile} from '../../service/api';
import useApi from '../../hooks/use_api';


export default function Profile(props: RouteComponentProps) {
    const [isModifiable, setModifiable] = useState(false);
    const {data, error, isLoading} = useApi(api.customer.getProfile);
    useTitle('我的资料');

    const ps = mapProperties(data).map(v => )

    if(isModifiable) {
        return
    }
    return
}