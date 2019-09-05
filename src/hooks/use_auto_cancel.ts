import { useEffect } from 'react';
import { CancelTokenSource } from 'axios';

export default function useAutoCancel () {
    const sources: Array<CancelTokenSource> = [];

    useEffect(function autoCancel() {
        return function cancelAll () {
            return sources.forEach(s => s.cancel('cancel...'))
        }
    })

    return function addSource (source: CancelTokenSource) {
        return sources.push(source)
    }
}