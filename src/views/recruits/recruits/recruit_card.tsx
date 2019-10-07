import React, { PropsWithChildren, useContext } from 'react';
import styled from 'styled-components/macro';

import Board from '../../../components/board';
import { Recruit } from '../../../services/api';
import LocationIcon from '../../../../assets/location.png';
import ThumbSrc from '../../../../assets/thumb.png';
import RouterContext from '../../../contexts/router';
import Link from '../../../components/link';

const Card = styled(Board)`
    border-radius: ${8 / 14}rem;
    margin: ${4 / 14}rem 0;
    padding: ${8 / 14}rem;
`;

const Title = styled.h3`
    color: #333333;
    font-weight: bold;
    padding: 0;
    margin: ${2 / 14}rem 0;
`;

const Price = styled.div`
    color: #B80000;
    font-size: ${20 / 14}rem;
    line-height: ${28 / 14}rem;
    ::after {
        content: '元/月';
        font-size: ${12 / 14}rem;
        color: #333333;
        margin-left: ${2 / 14}rem;
    }
`;

const LabelContainer = styled.div`
    margin: ${3 / 14}rem 0 ${2 / 14}rem 0;
`;

const Label = styled.span`
    display: inline-block;
    padding: 0 ${5 / 14}rem;
    color: #4A90E2;
    font-size: ${11 / 14}rem;
    line-height: ${16 / 14}rem;
    margin: 0 ${5 / 14}rem;
    border-radius: ${9 / 14}rem;
    background-color: #F0F0F0;
`;

const LocationContainer = styled.div`
    position: relative;
`;

const LocationImg = styled.img`
    height: ${12 / 14}rem;
    margin-top: ${2.5 / 14}rem;
    position: absolute;
    top: 0;
    left: 0;
`;

const LocationText = styled.div`
    font-size: ${12 / 14}rem;
    margin-left: ${15 / 14}rem;
    line-height: ${17 / 14}rem;
    color: #666666;
`;

function Location(props: PropsWithChildren<{}>) {
    return <LocationContainer>
        <LocationImg src={LocationIcon} />
        <LocationText>{props.children}</LocationText>
    </LocationContainer>
}

const ProgressContainer = styled.div`
    position: relative;
    line-height: 1rem;
    height: 1rem;
`;

const ProgressLeft = styled.div`
    font-size: ${10 / 14}rem;
    position: absolute;
    top: 0;
    left: 0;
    height: 1rem;
    color: #666666;
`;

const ProgressMiddle = styled.div`
    position: relative;
    top: ${4 / 14}rem;
    margin: ${4 / 14}rem ${64 / 14}rem ${4 / 14}rem ${53 / 14}rem;
    background-color: #D9DAD9;
    border-radius: ${3 / 14}rem;
`;

const ProgressRight = styled.div`
    position: absolute;
    font-size: ${10 / 14}rem;
    right: 0;
    top: 0;
    height: 1rem;
    color: #4A90E2;
    cursor: pointer;
`;

const ProgressBar = styled.div<{progress: number}>`
    width: ${({progress}) => progress + '%'};
    height: ${6 / 14}rem;
    background-color: #7FA370;
    border-radius: ${3 / 14}rem;
`;

const Thumb = styled.img`
    height: 100%;
    vertical-align: middle;
    margin-left: ${2 / 14}rem;
    margin-top: -0.2rem;
`;

function Progress(props: {
    estimateNumber: number,
    recruitNumber: number,
    id: number
}) {
    const { estimateNumber, recruitNumber, id } = props;

    return <ProgressContainer>
        <ProgressLeft>招聘进度</ProgressLeft>
        <ProgressMiddle>
            <ProgressBar progress={recruitNumber / estimateNumber * 100} />
        </ProgressMiddle>
        <ProgressRight><Link to={`/recruits/${id}`} >立即报名<Thumb src={ThumbSrc} /></Link></ProgressRight>
    </ProgressContainer>
}

export default function RecruitCard(props: Recruit) {
    const {
        title,
        minSalary,
        maxSalary,
        recruitLabels,
        companyAddress,
        estimateNumber,
        recruitNumber,
        id
    } = props;

    const Router = useContext(RouterContext)

    return <Card>
        <Title>{title}</Title>
        <Price>{minSalary}~{maxSalary}</Price>
        <LabelContainer>
            {recruitLabels.map(str => <Label key={str} >{str}</Label>)}
        </LabelContainer>
        <Location>{companyAddress}</Location>
        <Progress estimateNumber={estimateNumber} recruitNumber={recruitNumber} id={id} />
    </Card>
}