import React, { useState } from 'react';
import styled from 'styled-components/macro';

import useTitle from "../../hooks/use_title";
import Container from '../../components/container';
import Row from '../../components/row';
import RowHeader from '../../components/row_header';
import I from '../../components/input';
import Separator from '../../components/separator';
import { FullWidthButton, LightButton } from '../../components/buttons';
import Board from '../../components/board';

const Input = styled(I)`
    font-size: ${15 / 14}rem;
`;

export default function Password() {
    useTitle('修改密码');
    const [mobile, setMobile] = useState('');
    const [oldPwd, setOldPwd] = useState('');
    const [password, setPassword] = useState('');
    const [passwordEnsured, setPasswordEnsured] = useState('');

    function ensure() {
        return 
    }
    return <Container>
        <Board>
            <Row>
                <RowHeader>手机号</RowHeader>
                <Input value={mobile} onChange={e => setMobile(e.target.value)} placeholder='请输入手机号' />
            </Row>
            <Separator />
            <Row>
                <RowHeader>旧密码</RowHeader>
                <Input value={oldPwd} onChange={e => setOldPwd(e.target.value)} placeholder='请输入旧密码' />
            </Row>
            <Separator />
            <Row>
                <RowHeader>新密码</RowHeader>
                <Input value={password} onChange={e => setPassword(e.target.value)} placeholder='请输入密码' type='password' />
            </Row>
            <Separator />
            <Row>
                <RowHeader>确认密码</RowHeader>
                <Input value={passwordEnsured} onChange={e => setPasswordEnsured(e.target.value)} placeholder='请再次输入密码' type='password' />
            </Row>
            <FullWidthButton onClick={ensure} >确认修改</FullWidthButton>
        </Board>
    </Container>
}