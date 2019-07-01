import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import useApi from '../hooks/use_api';
import api from '../api';

export default function BaseView() {
    const {data, error, isLoading} = useApi(api.posts);
    if(isLoading) {
        return <div>Loading...</div>
    }
    if(error) {
        return <div style={{color: 'red'}}>
            ${JSON.stringify(error)}
        </div>
    }
    return <div>
        {data.list.map(r => <div>
            ${r.title}
        </div>)}
    </div>
}