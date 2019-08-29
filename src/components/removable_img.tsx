import React, { PropsWithChildren } from 'react';
import styled from 'styled-components/macro';

import del from '../../assets/delete.png';

const percentage = 16 / 14;
const Remove = styled.button`
    background-color: #cccccc;
    width: ${percentage}rem;
    height: ${percentage}rem;
    background-color: #cccccc;
    border-radius: 50%;
    margin-top: ${4 / 14}rem;
    margin-right: ${4 / 14}rem;
    float: right;
    position: relative;
`;

const PreviewContainer = styled.div`
    overflow: hidden;
    width: 100%;
    position: relative;
    height: 0;
    background-color: white;
    padding-bottom: 100%;
    border-radius: ${8 / 14}rem;
    position: relative;
`;

const PreviewImage = styled.img`
    position: absolute;
    display: block;
    width: 100%;
    bottom: 0;
    margin: auto;
`;

const Img = styled.img`
    width: 70%;
    margin: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute;
`;

const Uploading = styled.div`
    ::after {
        content: '上传中...'
    }
`;

export default function RemovableImg(props: PropsWithChildren<{
    onDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    url: string,
    isUploading: boolean
}>) {
    const {url, onDelete, isUploading} = props;
    return <PreviewContainer>
        {isUploading?
            <Uploading/>:
            <PreviewImage src={url} />
        }
        <Remove onClick={onDelete} ><Img src={del} alt='删除' /></Remove>
    </PreviewContainer>
}