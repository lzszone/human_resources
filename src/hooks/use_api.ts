import {useState, useEffect} from "react";

type TUsePromiseResult<T> = {
    data?: T,
    isLoading: boolean,
    error: any,
};

export default function useApi<T, I extends Array<any>>(callFunction?: (...args: I) => Promise<T>, ...inputs: I): TUsePromiseResult<T> {
    const [state, setState] = useState({
        isLoading: true,
        data: null,
        error: null
    });
    useEffect(function() {
        callFunction.apply(null, inputs)
            .then((d: any) => setState({isLoading: false, data: d, error: null}))
            .catch((e: Error) => setState({isLoading: false, data: null, error: e}));
    }, [])
    return state
}