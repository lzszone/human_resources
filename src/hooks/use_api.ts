import { useState, useEffect, useReducer } from "react";
import axios from 'axios';
import isEqual from 'lodash/isEqual';

import { UnwrappableResult } from '../service/api';

export interface UseStaticApiResult<T> {
    data?: T,
    isLoading: boolean,
    error?: Error,
};

export interface UsePaginationApiResult<T> {
    data?: T,
    isloading: boolean,
    error?: Error,
    loadNext?: () => void
};

function reducer<T>(state: T, action: T) {
    if (isEqual(state, action)) {
        return state
    }
    return action
}

const defualtPageArgs = {
    pageNum: 1,
    pageSize: 20
};

export function usePaginationApi<T, I extends Array<any>>(callFn: (...args: I) => UnwrappableResult<T>, ...inputs: I): UsePaginationApiResult<T> {
    const args = Object.assign({}, defualtPageArgs, inputs);
    
}

export default function useStaticApi<T, I extends Array<any>>(callFunction: (...args: I) => UnwrappableResult<T>, ...inputs: I): UseStaticApiResult<T> {
    const [args, dispatch] = useReducer(reducer, inputs);
    const [state, setState] = useState<UseStaticApiResult<T>>({
        isLoading: true,
    });

    useEffect(function () {
        dispatch(inputs);
    }, [inputs]);

    useEffect(function () {
        const { source, promise }: UnwrappableResult<T> = callFunction.apply(null, args);
        setState({
            isLoading: true,
        });
        promise
            .then((d: any) => setState({ isLoading: false, data: d }))
            .catch(e => {
                if (axios.isCancel(e)) {
                    return
                }
                return setState({ isLoading: false, error: e })
            });
        return () => { console.log('cancel'); source.cancel('cancel...') }
    }, [args]);

    return state
}