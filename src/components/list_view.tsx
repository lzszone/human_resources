import React, { PropsWithChildren, UIEvent } from 'react';
import throttle from 'lodash/throttle';
import styled from 'styled-components/macro';

import C from './container';

const Container = styled(C)`
    padding-top: 0;
    padding-bottom: 0;
`;

export default function ListView(props: PropsWithChildren<{onScrollToBottom?: () => void}>) {
    const { children, onScrollToBottom } = props;

    function handleScroll (e: UIEvent<HTMLDivElement>) {
        throttle(function () {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            if (onScrollToBottom && (scrollTop + clientHeight >= scrollHeight)) {
                onScrollToBottom()
            }
        }, 16);
    }

    return <Container onScroll={handleScroll} >
        {children}
    </Container>
}