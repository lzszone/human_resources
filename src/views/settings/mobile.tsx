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
import api from '../../services/api';

function tc(): Promise<{ticket: string, randstr: string}> {
    return new Promise((rs, rj) => {
        // @ts-ignore
        const t = new window.TencentCaptcha('2042364193', function(res: {ret: 0 | 2, ticket?: string, randstr?: string}) {
            const {ret, ticket, randstr} = res;
            if(ret === 2) {
                t.hide();
                return rj('user canceled')
            }
            rs({ticket, randstr});
            return t.hide()
        }, {bizState: {}});
        t.show()
    })
}

const GetCode = styled(LightButton)`
    float: right;
    position: absolute;
    top: ${10 / 14}rem;
    right: ${10 / 14}rem;
    ::after {
        clear: both;
    }
`;

const Input = styled(I)`
    font-size: ${15 / 14}rem;
`;

export default function Mobile() {
    useTitle('绑定手机');
    const [mobile, setMobile] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordEnsured, setPasswordEnsured] = useState('');

    function getCode() {
        return tc()
            .then(({randstr, ticket}) => {
                api.customer.sendAuthorizationCode(mobile, ticket, randstr).promise
                    .then(res => console.log(res))
                    .catch(e => console.error(e))
            })
    }

    function bindMobile() {
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
                <RowHeader>验证码</RowHeader>
                <Input value={code} onChange={e => setCode(e.target.value)} placeholder='请输入验证码' />
                <GetCode onClick={getCode} >获取验证码</GetCode>
            </Row>
            <Separator />
            <Row>
                <RowHeader>密码</RowHeader>
                <Input value={password} onChange={e => setPassword(e.target.value)} placeholder='请输入密码' type='password' />
            </Row>
            <Separator />
            <Row>
                <RowHeader>确认密码</RowHeader>
                <Input value={passwordEnsured} onChange={e => setPasswordEnsured(e.target.value)} placeholder='请再次输入密码' type='password' />
            </Row>
            <FullWidthButton onClick={bindMobile} >绑定</FullWidthButton>
        </Board>
    </Container>
}