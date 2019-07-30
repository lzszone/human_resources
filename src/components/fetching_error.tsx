import React from 'react';

export default function FetchingError(props: {error: Error}) {
    return <div>
        {props.error.message}
    </div>
}