import {useState, useEffect} from "react";
import axios from 'axios';

import {ApiResult} from '../api';

type UseApiResult<T> = {
    data?: T,
    isLoading: boolean,
    error: any,
};

export default function useApi<T, I extends Array<any>>(callFunction?: (...args: I) => ApiResult<T>, ...inputs: I): UseApiResult<T> {
    const [state, setState] = useState({
        isLoading: true,
        data: null,
        error: null
    });
    useEffect(function() {
        const {source, promise}: ApiResult<T> = callFunction.apply(null, inputs);
        promise
            .then((d: any) => setState({isLoading: false, data: d, error: null}))
            .catch(e => {
                if(axios.isCancel(e)) {
                    return
                }
                return setState({isLoading: false, data: null, error: e})
            });
        return () => source.cancel('cancel...')
    }, [])
    return state
}