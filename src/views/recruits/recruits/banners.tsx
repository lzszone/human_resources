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

export default function Banners(props: UseStaticApiResult<Array<Banner>>) {
    const {error, data, isLoading} = props;

    return renderPage(error, isLoading, data, (data) => <Container>
        <Slider {...settings} >
            {data.map(d => <div key={d.back} >
                <Img src={d.back} />
            </div>)}
        </Slider>
    </Container>)
}