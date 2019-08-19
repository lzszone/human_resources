import React from 'react';
import styled from 'styled-components/macro';
import { PropsWithChildren } from 'react';

const Elem = styled.section`
    color: #666666;
    font-size: ${12 / 14}rem;
`;

const Outer = styled.div`
    padding: ${15 / 14}rem ${8 / 14}rem ${5 / 14}rem ${8 / 14}rem;
`;

const Inner = styled.div`
    background-color: white;
`;

export default function Section(props: PropsWithChildren<{title: string}>) {
    return <div>
        <Outer>
            <Elem>
                {props.title}
            </Elem>
        </Outer>
        <Inner>
            {props.children}
        </Inner>
    </div>
};