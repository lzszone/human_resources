import React, { useState } from 'react';
import styled from 'styled-components/macro';

import useTitle from '../../hooks/use_title';
import useStaticApi from '../../hooks/use_api';
import api from '../../service/api';
import Input from '../../components/input';
import Container from '../../components/container';
import Section from '../../components/section';
import ModifiableRow from '../../components/modifiable_row';
import {FullWidthButton} from '../../components/buttons';
import Separator from '../../components/separator';
import renderPage from '../../components/render_page';

const Text = styled.span`
    font-weight: bold;
    font-size: ${15 / 14}rem;
`;

const Warning = styled.div`
    padding: ${11 / 14}rem ${8 / 14}rem ${26 / 14}rem ${8 / 14}rem;
    color: #666;
    font-size: ${12 / 14}rem;
`;

function Info() {
    return <Warning>
        &nbsp;!&nbsp;更加完善的资料能够使报名通过的几率更大
    </Warning>
}

export default function Profile() {
    useTitle('我的资料');
    const { data, error, isLoading } = useStaticApi(api.customer.getProfile);
    const [ modifiable, setModifiable ] = useState(false);
    
    return renderPage(error, isLoading, data, data => <Container>
        <Section title='基础资料' >
            <ModifiableRow modifiable={modifiable} label='姓名' >
                <Text>{data.realName}</Text>
                <Input type="text" value={data.realName} />
            </ModifiableRow>
            <Separator/>
            <ModifiableRow modifiable={modifiable} label='联系电话' >
                <Text>{data.mobile}</Text>
                <Input type="text" value={data.mobile} />
            </ModifiableRow>
            <Separator/>
            <ModifiableRow modifiable={modifiable} label='性别' >
                <Text>{data.sex === 1? '男': '女'}</Text>
                <Input type="text" value={data.sex === 1? '男': '女'} />
            </ModifiableRow>
            <Separator/>
            <ModifiableRow modifiable={modifiable} label='出生日期' >
                <Text>{data.birthDate}</Text>
                <Input type="text" value={data.birthDate} />
            </ModifiableRow>
            <Separator/>
            <ModifiableRow modifiable={modifiable} label='民族' >
                <Text>{data.perilRela}</Text>
                <Input type="text" value={data.perilRela} />
            </ModifiableRow>
            <Separator/>
            <ModifiableRow modifiable={modifiable} label='籍贯' >
                <Text>{data.nativePlace}</Text>
                <Input type="text" value={data.nativePlace} />
            </ModifiableRow>
        </Section>

        <Section title='技能资质' >
            <ModifiableRow modifiable={modifiable} label='学历' >
                <Text>{data.education}</Text>
                <Input type="text" value={data.education} />
            </ModifiableRow>
            <Separator/>
            <ModifiableRow modifiable={modifiable} label='个人技能' >
                <Text>{data.skills}</Text>
                <Input type="text" value={data.skills} />
            </ModifiableRow>
            <Separator/>
            <ModifiableRow modifiable={modifiable} label='资质证明' >
                <Text>{data.photos}</Text>
                <Input type="text" value={data.photos} />
            </ModifiableRow>
        </Section>

        <Section title='紧急联系人' >
            <ModifiableRow modifiable={modifiable} label='姓名' >
                <Text>{data.perilName}</Text>
                <Input type="text" value={data.perilName} />
            </ModifiableRow>
            <Separator/>
            <ModifiableRow modifiable={modifiable} label='联系电话' >
                <Text>{data.perilPhone}</Text>
                <Input type="text" value={data.perilPhone} />
            </ModifiableRow>
            <Separator/>
            <ModifiableRow modifiable={modifiable} label='关系' >
                <Text>{data.perilRela}</Text>
                <Input type="text" value={data.perilRela} />
            </ModifiableRow>
        </Section>

        <Info/>

        <FullWidthButton onClick={() => setModifiable(!modifiable)} >修改资料</FullWidthButton>
    </Container>)
}