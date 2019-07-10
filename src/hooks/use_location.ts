import {useState} from 'react';
import qs from 'qs';

export function useSearch<T>(search: string) {
    const rst: T = qs.parse(search.replace('?', ''));
    return useState(rst)
};

export function useHash<T>(hash: string) {
    const rst: T = qs.parse(hash.replace('#', ''));
    return useState(rst)
}