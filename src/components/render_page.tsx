import React from 'react';

import FetchingError from './fetching_error';
import Loading from './loading';

export default function renderPage<T>(error: Error, isLoading: boolean, data: T, render: (data: T) => JSX.Element): JSX.Element {
    if (isLoading) {
        return <Loading/>
    }
    if (error) {
        return <FetchingError error={error} />
    }
    return render(data)
}