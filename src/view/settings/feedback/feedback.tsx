import React, { useState, ChangeEvent, useRef } from 'react';
import styled from 'styled-components/macro';
import { RouteComponentProps } from 'react-router-dom';

import Section from '../../../components/section';
import Container from '../../../components/container';
import _row from '../../../components/row';
import RowHeader from '../../../components/row_header';
import RemovableImg from '../../../components/removable_img';
import AddImg from '../../../../assets/add.png';
import { FullWidthButton } from '../../../components/buttons';
import api from '../../../service/api';
import useTitle from '../../../hooks/use_title';
import Link from '../../../components/link';
import theme from '../../../components/theme';

const FullWidthLink = styled(Link)`
    display: block;
    width: 100%;
    text-align: center;
    color: ${theme.blue};
    font-size: ${18 / 14}rem;
`;

const Row = styled(_row)`
    margin-bottom: ${8 / 14}rem;
`;

const typeMap = {
    1: '意见反馈',
    2: '投诉'
};

const complaintTypeIdMap = {
    1: '投诉工时'
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

export default function Feedback(props: RouteComponentProps) {
    const {match: {path}} = props;
    useTitle('意见反馈');
    const uploaderRef = useRef(null);
    const [type, setType] = useState(0);
    const [content, setContent] = useState('');
    const [evidences, setEvidences] = useState<Array<{url: string, isUploading: boolean}>>([]);
    const [complaintTypeId, setCompaintTypeId] = useState(undefined);

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

    function changeType(e: ChangeEvent<HTMLSelectElement>) {
        if(Number(e.target.value) === 1) {
            setCompaintTypeId(undefined);
            setType(1)
        } else {
            setCompaintTypeId(1);
            setType(2)
        }
    }

    return <Container>
        <Row>
            <RowHeader>反馈类型</RowHeader>
            <Select value={type} onChange={changeType} >
                <option value='0' hidden >请选择</option>
                {Object.entries(typeMap).map(([type, text]) => 
                    <option value={type} key={type} >{text}</option>
                )}
            </Select>
        </Row>
        {type === 2? 
                <Row>
                    <RowHeader>投诉类型</RowHeader>
                    <Select value={complaintTypeId} onChange={e => setCompaintTypeId(Number(e.target.value))} >
                        {Object.entries(complaintTypeIdMap).map(([cTypeId, text]) => 
                            <option value={cTypeId} key={cTypeId} >{text}</option>    
                        )}
                    </Select>
                </Row>
                :
                null
            }
        {type === 0?
            <Row><FullWidthLink to={`${path}list`}>反馈记录</FullWidthLink></Row>
            :
            <>
                <Section title={<ContentDescriptionTitle>内容描述</ContentDescriptionTitle>} >
                    <Text placeholder='请告诉我们您的宝贵意见, 我们会认真对待' value={content} onChange={e => setContent(e.target.value)} />
                </Section>
                <Section title='截图(选填)' >
                    <Wrapper2>
                        {evidences.map({} => 
                            <Wrapper key={url}><RemovableImg url={url} onDelete={e => del(url)} /></Wrapper> 
                        )}
                        <Wrapper><AddButton onClick={e => add('https://wrong')} /></Wrapper> 
                    </Wrapper2>
                </Section>
                <FullWidthButton onClick={e => submit()} >提交</FullWidthButton>
            </>
        }
        <input type="file" hidden ref={uploaderRef} onChange={e => add(e.target.files[0])} />
    </Container>
}