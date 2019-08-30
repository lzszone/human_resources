import React, { PropsWithChildren, HtmlHTMLAttributes } from 'react';
import styled from 'styled-components/macro';

import Mask from './mask';
import Button from './buttons';
import theme from './theme';

const Container = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 50%;
    margin: auto;
`;

export default function Modal(props: PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>>) {
    const {children, ...rest} = props;

    return <Mask {...rest} >
        <Container>
            {children}
        </Container>
    </Mask>
}