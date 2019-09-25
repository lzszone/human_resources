import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import {CancelTokenSource} from 'axios';

import useTitle from '../../hooks/use_title';
import { UseStaticApiResult } from '../../hooks/use_api';
import api, { CustomerProfile } from '../../services/api';
import Input from '../../components/input';
import Container from '../../components/container';
import Section from '../../components/section';
import ModifiableRow from '../../components/modifiable_row';
import {FullWidthButton} from '../../components/buttons';
import Separator from '../../components/separator';
import renderPage from '../../components/render_page';
import WarningSrc from '../../../assets/warning.png';

const Text = styled.span`
    font-weight: bold;
    font-size: ${15 / 14}rem;
`;

const Warning = styled.div`
    padding: ${11 / 14}rem ${8 / 14}rem ${26 / 14}rem ${8 / 14}rem;
    color: #666;
    font-size: ${12 / 14}rem;
    vertical-align: middle;
`;

const Img = styled.img`
    width: ${12 / 14}rem;
    vertical-align: middle;
`;

function Info() {
    return <Warning>
        <Img src={WarningSrc} />更加完善的资料能够使报名通过的几率更大
    </Warning>
}

export default function Profile() {
    useTitle('我的资料');
    const { data, error, isLoading } = useState<{
        isLoading: boolean,
        error?: null | Error,
        data?: CustomerProfile
    }>({
        isLoading: true
    });
    const sources: Array<CancelTokenSource> = [];
    useEffect(function () {
        const {promise, source} = api.customer.getProfile()
        sources.push(source);
        promise.then()
    }, []);
    // useEffect(function ())
    const [ modifiable, setModifiable ] = useState(false);
    const [ state, set] = useState<CustomerProfile>();
    
    return renderPage(error, isLoading, data, data => {
        if(!state) {
            setState(data)
        }
        
        const {
            realName,
            mobile,
            sex,
            birthDate,
            nation,
            nativePlace,
            education,
            skills,
            photos,
            perilName,
            perilPhone,
            perilRela
        } = data

        return <Container>
            <Section title='基础资料' >
                <ModifiableRow modifiable={modifiable} label='姓名' >
                    <Text>{realName}</Text>
                    <Input type="text" value={realName} onChange={e => setState({...data, realName: e.target.value})} />
                </ModifiableRow>
                <Separator/>
                <ModifiableRow modifiable={modifiable} label='联系电话' >
                    <Text>{mobile}</Text>
                    <Input type="text" value={mobile} onChange={e => setState({...data, mobile: e.target.value})} />
                </ModifiableRow>
                <Separator/>
                <ModifiableRow modifiable={modifiable} label='性别' >
                    <Text>{sex === 1? '男': '女'}</Text>
                    <Input type="text" value={sex === 1? '男': '女'} onChange={e => setState({...data, sex: e.target.value === '男'? 1: 2})} />
                </ModifiableRow>
                <Separator/>
                {/* <ModifiableRow modifiable={modifiable} label='出生日期' >
                    <Text>{birthDate}</Text>
                    <Input type="text" value={birthDate} />
                </ModifiableRow> */}
                <Separator/>
                <ModifiableRow modifiable={modifiable} label='民族' >
                    <Text>{nation}</Text>
                    <Input type="text" value={nation} onChange={e => setState({...data, nation: e.target.value})} />
                </ModifiableRow>
                <Separator/>
                <ModifiableRow modifiable={modifiable} label='籍贯' >
                    <Text>{nativePlace}</Text>
                    <Input type="text" value={nativePlace} onChange={e => setState({...data, nativePlace: e.target.value})} />
                </ModifiableRow>
            </Section>

            <Section title='技能资质' >
                <ModifiableRow modifiable={modifiable} label='学历' >
                    <Text>{education}</Text>
                    <Input type="text" value={education} onChange={e => setState({...data, education: e.target.value})} />
                </ModifiableRow>
                <Separator/>
                {/* <ModifiableRow modifiable={modifiable} label='个人技能' >
                    <Text>{skills}</Text>
                    <Input type="text" value={skills} />
                </ModifiableRow> */}
                <Separator/>
                {/* <ModifiableRow modifiable={modifiable} label='资质证明' >
                    <Text>{photos}</Text>
                    <Input type="text" value={photos} />
                </ModifiableRow> */}
            </Section>

            <Section title='紧急联系人' >
                <ModifiableRow modifiable={modifiable} label='姓名' >
                    <Text>{perilName}</Text>
                    <Input type="text" value={perilName} onChange={e => setState({...data, perilName: e.target.value})} />
                </ModifiableRow>
                <Separator/>
                <ModifiableRow modifiable={modifiable} label='联系电话' >
                    <Text>{perilPhone}</Text>
                    <Input type="text" value={perilPhone} onChange={e => setState({...data, perilPhone: e.target.value})} />
                </ModifiableRow>
                <Separator/>
                <ModifiableRow modifiable={modifiable} label='关系' >
                    <Text>{perilRela}</Text>
                    <Input type="text" value={perilRela} onChange={e => setState({...data, perilRela: e.target.value})} />
                </ModifiableRow>
            </Section>

            <Info/>

            <FullWidthButton onClick={() => setModifiable(!modifiable)} >修改资料</FullWidthButton>
        </Container>
    })
}