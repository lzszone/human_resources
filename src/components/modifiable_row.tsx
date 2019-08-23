import React, { PropsWithChildren } from 'react';
import styled from 'styled-components/macro';

import Row from './row';
import RowHeader from './row_header';

export default function ModifiableRow(props: PropsWithChildren<{
    modifiable: boolean,
    label: string,
    children: [JSX.Element, JSX.Element]
}>) {
    const {
        modifiable,
        children: [display, modify],
        label
    } = props;
    if (modifiable) {
        return <Row>
            <RowHeader>{label}</RowHeader>
            {modify}
        </Row>
    }
    return <Row>
        <RowHeader>{label}</RowHeader>
        {display}
    </Row>
}