import React, { PropsWithChildren } from 'react';
import styled from 'styled-components/macro';

import Board from '../../../components/board';
import { Recruit } from '../../../services/api';
import LocationIcon from '../../../../assets/location.png';

// <Link to={`${match.path}/${r.id}`} >{r.title}</Link>
const Card = styled(Board)`
    border-radius: ${8 / 14}rem;
    margin: ${4 / 14}rem 0;
    padding: ${8 / 14}rem;
`;

const Title = styled.h3`
    color: #333333;
    font-weight: bold;
    padding: 0;
    margin: 0;
`;

const Price = styled.div`
    color: #B80000;
    font-size: ${20 / 14}rem;
    ::after {
        content: '元/月';
        font-size: ${12 / 14}rem;
        color: #333333;
    }
`;

const Label = styled.span`
    display: inline-block;
    padding: 1px ${5 / 14}rem;
    color: #4A90E2;
    font-size: ${11 / 14}rem;
    margin: ${5 / 14}rem;
    border-radius: ${9 / 14}rem;
    background-color: #F0F0F0;
`;

const LocationContainer = styled.div`
    position: relative;
`;

const LocationImg = styled.img`
    height: ${12 / 14}rem;
    position: absolute;
    top: 0;
    left: 0;
`;

const LocationText = styled.div`
    font-size: ${12 / 14}rem;
    margin-left: ${15 / 14}rem;
    color: #666666;
`;

function Location(props: PropsWithChildren<{}>) {
    return <LocationContainer>
        <LocationImg src={LocationIcon} />
        <LocationText>{props.children}</LocationText>
    </LocationContainer>
}

export default function RecruitCard(props: Recruit) {
    const {
        title,
        minSalary,
        maxSalary,
        recruitLabels,
        companyAddress
    } = props;

    return <Card>
        <Title>{title}</Title>
        <Price>{minSalary}~{maxSalary}</Price>
        <div>
            {recruitLabels.map(str => <Label key={str} >{str}</Label>)}
        </div>
        <Location>{companyAddress}</Location>
    </Card>
}