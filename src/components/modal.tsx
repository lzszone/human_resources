import React, { PropsWithChildren, HtmlHTMLAttributes, Ref } from 'react';
import styled from 'styled-components/macro';

import Mask from './mask';

const Container = styled.div`
    position: relative;
    height: 100%;
`;

const Modal = React.forwardRef(function (props: PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>>, ref: Ref<HTMLDivElement>) {
    const {children, ...rest} = props;

    return <Mask>
        <Container ref={ref} {...rest} >
            {children}
        </Container>
    </Mask>
})

export default Modal