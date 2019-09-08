import { useState, useEffect, useReducer } from "react";
import axios from 'axios';
import isEqual from 'lodash/isEqual';

import { UnwrappableResult, ListData } from "../services/api";

export interface UseStaticApiResult<T> {
    data?: T,
    isLoading: boolean,
    error?: Error,
};

export interface UsePaginationApiResult<T> {
    data?: T,
    isLoading: boolean,
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

export function usePaginationApi<T extends ListData<any>, I extends Array<any>>(callFn: (...args: I) => UnwrappableResult<T>, ...inputs: I): UsePaginationApiResult<T> {
    const [_args, dispatch] = useReducer(reducer, inputs);

    const args = Object.assign({}, defualtPageArgs, _args);
    const [state, setState] = useState<UsePaginationApiResult<T>>({
        isLoading: true,
    });

    useEffect(function () {
        dispatch(inputs);
    }, [inputs]);

    const sources = [];

    useEffect(function loadNext () {
        const { source, promise }: UnwrappableResult<T> = callFn.apply(null, args);
        setState({isLoading: true});
        promise
            .then(data => {
                args.pageNum ++;
                let list: Array<any>;
                if(args.pageNum !== 2) {
                    list = (state.data? state.data.list: []).concat(data.list)
                } else {
                    list = data.list
                }

                return setState({
                    isLoading: false, 
                    data: {
                        ...state.data,
                        list
                    },
                    loadNext: data.hasNextPage && data.list.length === args.pageSize? loadNext: undefined
                })
            })
            .catch(e => {
                if(axios.isCancel(e)) {
                    return 
                }
                return setState({
                    isLoading: false,
                    error: e
                })
            });
        sources.push(source);
        return function () { sources.forEach(s => s.cancel('cancel...')) }
    }, [_args]);

    return state
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
            .then(data => {
                setState({ isLoading: false, data })
            })
            .catch((e: Error) => {
                if (axios.isCancel(e)) {
                    return
                }
                return setState({ isLoading: false, error: e })
            });
        return function () { source.cancel('cancel...') }
    }, [args]);

    return state
}