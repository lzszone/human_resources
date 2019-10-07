import React, { useEffect, useContext } from 'react';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components/macro';
import { CancelTokenSource } from 'axios';

import useStaticApi from '../../../hooks/use_api';
import api from '../../../services/api';
import renderPage from '../../../components/render_page';
import Container from '../../../components/container';
import ModalContext from '../../../contexts/modal';
import Row from '../../../components/row';
import RowHeader from '../../../components/row_header';
import Section from '../../../components/section';
import Separator from '../../../components/separator';
import Info from '../../../components/info';
import Text from '../../../components/row_text';
import Tag from '../../../components/tag';
import TagContainer from '../../../components/tag_container';
import PaddingWrapper from '../../../components/p_33_padding_wrapper';
import PreviewImage from '../../../components/preview_image';
import W33 from '../../../components/p_33_element_wrapper';

const Ensure = styled.button`
    color: white;
    background-color: #4A90E2;
    font-size: ${16 / 14}rem;
    height: ${56 / 14}rem;
    width: 100%;
    position: fixed;
    bottom: 0;
    right: 0;
`;

export default function Signup(props: RouteComponentProps<{ id: string }>) {
    const { history, match: {params: {id}} } = props;
    const { error, data, isLoading } = useStaticApi(api.recruit.detail, Number(id));
    const { error: fetchingProfileError, isLoading: profileLoading, data: profile } = useStaticApi(api.customer.getProfile);
    const sources: Array<CancelTokenSource> = [];
    useEffect(function () {
        return () => sources.forEach(s => s.cancel())
    }, []);
    const Modal = useContext(ModalContext);

    function handleSignup(id: number) {
        const { promise, source } = api.recruit.signup(id);
        sources.push(source);
        promise
            .then(() => Modal.show({title: '结果', message: '报名成功'}, () => history.push('/job_signups')))
            .catch(e => Modal.show({title: '', message: e.message}, () => history.push('/job_signups')))
    }
    
    return renderPage(error || fetchingProfileError, isLoading || profileLoading, data, data => <Container> 
        <Section title='请确认报名信息' >
            <Row>
                <RowHeader>公司名称</RowHeader>
                <Text>{data.companyName}</Text>
            </Row>
            <Separator/>
            <Row>
                <RowHeader>平均薪资</RowHeader>
                <Text>{data.minSalary}~{data.maxSalary}元/月</Text>
            </Row>
            <Separator/>
            <Row>
                <RowHeader>地点</RowHeader>
                <Text>{data.companyAddress}</Text>
            </Row>
            <Separator/>
            <Row>
                <RowHeader>工种</RowHeader>
                <Text>{data.companyJobName}</Text>
            </Row>
            <Separator/>
            <Row>
                <RowHeader>到岗时间</RowHeader>
                <Text>{data.arrivalTime}</Text>
            </Row>
            <Separator/>
            <Row>
                {data.recruitLabels.map(label => 
                    <Tag key={label} >{label}</Tag>    
                )}
            </Row>
        </Section>
        <Section title='请确认一下资料是否正确' >
            <Row>
                <RowHeader>姓名</RowHeader>
                <Text>{profile.realName}</Text>
            </Row>
            <Row>
                <RowHeader>性别</RowHeader>
                <Text>{profile.sex === 1? '男': '女'}</Text>
            </Row>
            <Row>
                <RowHeader>出生日期</RowHeader>
                <Text>{profile.birthDate}</Text>
            </Row>
            <Row>
                <RowHeader>民族</RowHeader>
                <Text>{profile.nation}</Text>
            </Row>
            <Row>
                <RowHeader>籍贯</RowHeader>
                <Text>{profile.nativePlace}</Text>
            </Row>
            <Row>
                <RowHeader>学历</RowHeader>
                <Text>{profile.education}</Text>
            </Row>
            <Row>
                <RowHeader>个人技能</RowHeader>
                <TagContainer>
                    {profile.skills.map(str =>
                        <Tag key={str} >{str}</Tag>    
                    )}
                </TagContainer>
            </Row>
            <Row>
                <RowHeader>资质证明</RowHeader>
                <PaddingWrapper>
                    {profile.photos.map(str =>
                        <W33 key={str} >
                            <PreviewImage src={str} />
                        </W33>    
                    )}
                </PaddingWrapper>
            </Row>
            <Info />
        </Section>
        <Ensure onClick={e => handleSignup(Number(id))} >立即报名</Ensure>
    </Container>)
}