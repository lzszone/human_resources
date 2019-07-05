import React from 'react';

import useApi from '../hooks/use_api';
import useRouter from '../hooks/use_router';
import api from '../api';

export default function BaseView() {
    const {data, error, isLoading} = useApi(api.recruit.list, {});
    const {location, path} = useRouter();
    if(isLoading) {
        return <div>Loading...</div>
    }
    if(error) {
        return <div style={{color: 'red'}}>
            {JSON.stringify(error)}
        </div>
    }
    return <div>
        <div>
            {path}
        </div>
        <div>
            {JSON.stringify(location)}
        </div>
        {data.list.map(r => <div key={r.id}>
            {r.title}
        </div>)}
    </div>
}