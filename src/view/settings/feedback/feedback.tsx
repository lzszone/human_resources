import React, { useState } from 'react';
import styled from 'styled-components/macro';

import Section from '../../../components/section';
import Container from '../../../components/container';
import Row from '../../../components/row';
import RowHeader from '../../../components/row_header';
import RemovableElement from '../../../components/removable_element';
import AddImg from '../../../../assets/add.png';
import { FullWidthButton } from '../../../components/buttons';
import api from '../../../service/api';
import useTitle from '../../../hooks/use_title';

const typeMap = {
    1: '意见反馈',
    2: '投诉'
};

const ContentDescriptionTitle = styled.span`
    ::after {
        content: '*';
        color: red;
    }
`;

const AddButton = styled.button`
    display: block;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    background-image: url("${AddImg}");
    background-repeat: no-repeat;
    background-size: 50%;
    background-position: center;
    background-color: white;
    border-radius: ${8 / 14}rem;
`;

const Text = styled.textarea`
    width: 100%;
    box-sizing: border-box;
    height: ${128 / 14}rem;
`;

const Wrapper = styled.div`
    width: 33.33%;
    display: inline-block;
    padding: ${4 / 14}rem;
    box-sizing: border-box;
    vertical-align: middle;
`;

const Wrapper2 = styled.div`
    padding: ${4 / 14}rem ${4 / 14}rem;
`;

const Select = styled.select`
    float: right;
    border: none;
`;

export default function Feedback() {
    useTitle('意见反馈');
    const [type, setType] = useState(1);
    const [content, setContent] = useState('');
    const [evidences, setEvidences] = useState([]);

    function del(url: string) {
        const index = evidences.findIndex(el => el.url === url);
        if(index) {
            setEvidences(evidences.filter(_url => _url !== url))
        }
    }

    function add(url: string) {
        setEvidences(evidences.concat(url))
    }

    function submit() {
        api.complaint.submit({
            type, 
            content,
            evidences
        })
    }

    return <Container>
        <Row>
            <RowHeader>反馈类型</RowHeader>
            <Select value={type} onChange={e => setType(Number(e.target.value))} >
                {Object.entries(typeMap).map(([type, text]) => 
                    <option value={type} key={type} >{text}</option>
                )}
            </Select>
        </Row>
        <Section title={<ContentDescriptionTitle>内容描述</ContentDescriptionTitle>} >
            <Text placeholder='请告诉我们您的宝贵意见, 我们会认真对待' value={content} onChange={e => setContent(e.target.value)} />
        </Section>
        <Section title='截图(选填)' >
            <Wrapper2>
                {evidences.map(url => 
                    <Wrapper key={url}><RemovableElement url={url} onDelete={e => del(url)} /></Wrapper> 
                )}
                <Wrapper><AddButton onClick={e => add('https://cn.bing.com/?FORM=Z9FD1')} /></Wrapper> 
            </Wrapper2>
        </Section>
        <FullWidthButton onClick={e => submit()} >提交</FullWidthButton>
    </Container>
}