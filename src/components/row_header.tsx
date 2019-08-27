import React, { PropsWithChildren } from 'react';
import styled from 'styled-components/macro';

const El = styled.div`
    display: inline-flex;
    justify-content: space-between;
    width: 4rem;
    margin-right: ${8 / 14}rem;
    color: #666666;
`;

export default function RowHeader(props: PropsWithChildren<{children: string}>) {
    return <El>
        {Array.prototype.map.call(props.children, function(str: string) {
            return <div key={str}>{str}</div>
        })}
    </El>
}