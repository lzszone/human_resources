import React, { useEffect, useContext } from 'react';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components/macro';
import { CancelTokenSource } from 'axios';

import useStaticApi from '../../hooks/use_api';
import api from '../../services/api';
import renderPage from '../../components/render_page';
import RecruitCard from './recruits/recruit_card';
import Banners from './recruits/banners';
import Container from '../../components/container';
import ModalContext from '../../contexts/modal';

const Inner = styled.div`
    background-color: white;
    padding: 0 ${8 / 14}rem ${27 / 14}rem ${8 / 14}rem;
`;

const Seek = styled.button`
    color: #666666;
    background-color: white;
    font-size: ${16 / 14}rem;
    height: ${56 / 14}rem;
    width: ${109 / 360 * 100}%;
    position: fixed;
    bottom: 0;
    left: 0;
`;

const Signup = styled.button`
    color: white;
    background-color: #4A90E2;
    font-size: ${16 / 14}rem;
    height: ${56 / 14}rem;
    width: ${251 / 360 * 100}%;
    position: fixed;
    bottom: 0;
    right: 0;
`;

const TextContainer = styled.div`
    padding: ${21 / 14}rem 0 ${97 / 14}rem;
`;

const Text = styled.div`
    color: #666666;
    line-height: ${20 / 14}rem;
    text-align: center;
`;

export default function Detail(props: RouteComponentProps<{ id: string }>) {
    const { history, match: {params: {id}} } = props;
    const { error, data, isLoading } = useStaticApi(api.recruit.detail, Number(id));
    if(data) {
        data.bannerList.forEach(b => b['back'] = b.previewPath)
    }
    const sources: Array<CancelTokenSource> = [];
    useEffect(function () {
        return () => sources.forEach(s => s.cancel())
    }, []);
    const Modal = useContext(ModalContext);

    function handleSignup(id: number) {
        const { promise, source } = api.recruit.signup(id);
        sources.push(source);
        promise
            .then(() => Modal.show({title: '结果', message: '报名成功'}, () => history.push('job_signups')))
            .catch(e => Modal.show({title: '出错啦', message: e.message}))
    }
    
    return renderPage(error, isLoading, data, data => <Container> 
        <Banners error={null} isLoading={false} data={data.bannerList as Array<any>} />
        <Inner>
            <RecruitCard {...data} />
            <div dangerouslySetInnerHTML={{__html: data.recruitContent}} />
        </Inner>
        <TextContainer>
            <Text>—— 口碑劳务 ——</Text>
        </TextContainer>
        <Seek>电话咨询</Seek>
        <Signup onClick={e => handleSignup(Number(id))} >立即报名</Signup>
    </Container>)
}