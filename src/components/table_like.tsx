import React from 'react';

export interface PropertyValue<K, V, T> {
    label: string,
    value: V,
    key: K,
    metadata: T,
};

export type RowRender<T, K, V> = (props: PropertyValue<T, K, V>) => JSX.Element;

export interface TableLikeRow<T, K, V> extends PropertyValue<T, K, V> {
    render: RowRender<T, K, V>
};

export type TableLikeRows<T, K, V> = Array<TableLikeRow<T, K, V>>;

export function mapProperties<T, K extends keyof T>(props: T, translation: {[k in keyof T]?: string}): Array<PropertyValue<K, T[K], T>> {
    const result = [];
    for(const key in translation) {
        if(Object.hasOwnProperty(key)) {
            const value = props[key];
            result.push({
                label: translation[key],
                value: value,
                key,
                metadata: props
            })
        }
    }
    return result
    // return Object.entries(translation).map(([k: K, v: T[K]]) => ({
    //     label: translation[k],
    //     value: v,
    //     key: k
    // }))
};

export interface TableLikeProps<T> {
    row: TableLikeRow, 
    data: T
}

export default function TableLike<T>(props: TableLikeProps<T>) {
    return 
}