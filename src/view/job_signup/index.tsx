import React from 'react';
import {RouteComponentProps} from 'react-router';

import useApi from '../../hooks/use_api';
import api from '../../service/api';
import useTitle from '../../hooks/use_title';

export default function JobSignup(props: RouteComponentProps) {
    useTitle('报名记录');
    useApi(api.customer.jobSignupHistory.list)
}