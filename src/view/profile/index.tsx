import React, {useState} from 'react';
import {RouteComponentProps} from 'react-router';

import useTitle from '../../hooks/use_title';
import api, {CustomerProfile} from '../../service/api';
import useApi from '../../hooks/use_api';
import TableLike from '../../components/table_like';
import ModifiableRow from '../../components/modifiable_row';
import FetchingError from '../../components/fetching_error';
import Loading from '../../components/loading';


export default function Profile(props: RouteComponentProps) {
    const [isModifiable, setModifiable] = useState(false);
    const {data, error, isLoading} = useApi(api.customer.getProfile);
    const [innerState, setinnerState] = useState(data);
    useTitle('我的资料');

    if(error) {
        return <FetchingError error={error} />
    }

    if(isLoading) {
        return <Loading />
    }

    return <div>
        <TableLike title='基础资料'>
            <ModifiableRow modifiable={isModifiable} label='姓名' >
                <span>{data.perilName}</span>
                <input type="text" value={innerState.perilName} onChange={e => setinnerState({...innerState, perilName: e.target.value})} />
            </ModifiableRow>
        </TableLike>
    </div>
}