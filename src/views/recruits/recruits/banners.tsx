import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from 'styled-components';

import { UseStaticApiResult } from '../../../hooks/use_api';
import renderPage from '../../../components/render_page';
import { Banner, ListData } from '../../../services/api';

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
};

const Img = styled.img`
    width: 100%;
`;

const Container = styled.div`
    margin: 1.8rem 0;
`;

const C = styled.div`
    height: 0;
    padding-bottom: ${150 / 360 * 100}%;
    width: 100%;
`;

export default function Banners(props: UseStaticApiResult<Array<Banner>>) {
    const {error, data, isLoading} = props;

    return renderPage(error, isLoading, data, (data) => <Container>
        <Slider {...settings} arrows={false} >
            {data.map(d => <C key={d.back} >
                <Img src={d.back} />
            </C>)}
        </Slider>
    </Container>)
}