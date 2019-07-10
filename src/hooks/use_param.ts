import {useState, Dispatch, SetStateAction} from 'react';

type UseParamResult<T> = {
    [key in keyof T]: string | number
};

interface StringDict {
    [key: string]: string
}

export default function useParam<T extends StringDict>(params: T): [UseParamResult<T>, Dispatch<SetStateAction<UseParamResult<T>>>] {
    const rst = {};
    Object.entries(params).forEach(([key, value]) => {
        const parsed = parseInt(value);
        if(parsed === NaN) {
            return rst[key] = value
        }
        return rst[key] = parsed
    });
    return useState(rst as UseParamResult<T>)
}