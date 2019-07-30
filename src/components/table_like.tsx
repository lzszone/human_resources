import React, {PropsWithChildren} from 'react';

export default function TableLike(props: PropsWithChildren<{title: string}>) {
    const {children, title} = props;
    return <div>
        <h6>{title}</h6>
        {children}
    </div>
}