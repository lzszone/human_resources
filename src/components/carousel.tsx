import React, {useState} from 'react';
import styled from 'styled-components/macro';
import {Link as L} from 'react-router-dom';
import {throttle} from 'lodash';
import console = require('console');

enum LinkType {
    web = 0,
    recruit = 1
};

export interface BannerProps {
    type: LinkType,
    title: string,
    content: string,
    url?: string,
    back: string,
    recuitId?: number,
    sort: number
};

const Link = styled(L)`
    display: inline-block;
    color: white;
    text-decoration: none;
`;

const Container = styled.div`
    overflow: hidden;
`;

const Inner = styled.div`
    transition: margin-left 0.5s;
`;

function Banner(props: BannerProps) {
    const url = props.type === LinkType.web? 
        props.url:
        `/recruits/${props.recuitId}`;
    return <Link to={url} >
        <img src={props.back} alt={props.title} />
    </Link>
}

export default function Carousel(props: {
    data: Array<BannerProps>
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const total = props.data.length;
    const marginLeft = `-${currentIndex * 100}%`;
    let lastScreenX;
    function handleMouseMove(e: MouseEvent) {
        e.preventDefault();
        if(!lastScreenX) {
            lastScreenX = e.screenX
        }
        throttle(function(e: MouseEvent) {
            if(e.screenX - lastScreenX > 10) {
                setCurrentIndex((currentIndex + 1) % total)
            } else if(e.screenX - las)
        }, 16);
    }

    return <Container>
        <Inner style={{marginLeft}} onMouseMove={e => } >
            {props.data.map((v, i) => <Banner {...v} key={i} />)}
        </Inner>
    </Container>
}