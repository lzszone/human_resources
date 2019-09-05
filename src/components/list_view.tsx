import React, { PropsWithChildren, UIEvent } from 'react';
import throttle from 'lodash/throttle';

import Container from './container';

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