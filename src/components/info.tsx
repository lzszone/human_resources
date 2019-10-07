import React from 'react';
import styled from 'styled-components/macro';
import WarningSrc from '../../assets/warning.png';

const Warning = styled.div`
    padding: ${11 / 14}rem ${8 / 14}rem ${26 / 14}rem ${8 / 14}rem;
    color: #666;
    font-size: ${12 / 14}rem;
    vertical-align: middle;
`;

const Img = styled.img`
    width: ${12 / 14}rem;
    vertical-align: middle;
`;

export default function Info() {
    return <Warning>
        <Img src={WarningSrc} />更加完善的资料能够使报名通过的几率更大
    </Warning>
}