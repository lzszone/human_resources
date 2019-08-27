import { useState, useEffect, useReducer } from "react";
import axios from 'axios';
import isEqual from 'lodash/isEqual';

import { ApiResult } from '../service/api';

type UseApiResult<T> = {
    data?: T,
    isLoading: boolean,
    error: any,
};

function reducer<T>(state: T, action: T) {
    if (isEqual(state, action)) {
        return state
    }
    return action
}

export default function useApi<T, I extends Array<any>>(callFunction: (...args: I) => ApiResult<T>, ...inputs: I): UseApiResult<T> {
    const [args, dispatch] = useReducer(reducer, inputs);
    const [state, setState] = useState({
        isLoading: true,
        data: null,
        error: null
    });

    useEffect(function () {
        dispatch(inputs);
    }, [inputs]);

    useEffect(function () {
        const { source, promise }: ApiResult<T> = callFunction.apply(null, args);
        setState({
            isLoading: true,
            data: null,
            error: null
        });
        promise
            .then((d: any) => setState({ isLoading: false, data: d, error: null }))
            .catch(e => {
                if (axios.isCancel(e)) {
                    return
                }
                return setState({ isLoading: false, data: null, error: e })
            });
        return () => { console.log('cancel'); source.cancel('cancel...') }
    }, [args]);

    return state
}