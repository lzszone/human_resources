import React, { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import styled from 'styled-components/macro';

import theme from './theme';

export const Button = styled.button`
    background-color: ${theme.blue};
    color: white;
    border-radius: ${5 / 14}rem;
    border: none;
    cursor: pointer;
`;

const Btn = styled(Button)`
    display: block;
    width: 100%;
    text-align: center;
    height: ${48 / 14}rem;
`;

export function FullWidthButton(props: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
    return <div style={{padding: '0.5rem'}}>
        <Btn {...props} >{props.children}</Btn>
    </div>
};

export const LightButton = styled(Button)`
    color: ${theme.blue};
    background-color: inherit;
`;

export default Button;
