import React, { useState } from 'react';
import styled from 'styled-components/macro';

import useTitle from '../../hooks/use_title';
import useApi from '../../hooks/use_api';
import api from '../../service/api';
import Loading from '../../components/loading';
import FetchingError from '../../components/fetching_error';
import Container from '../../components/container';
import Section from '../../components/section';
import ModifiableRow from '../../components/modifiable_row';
import Button from '../../components/button';

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

const Btn = styled(Button)`
    display: block;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    height: ${48 / 14}rem;
`;

export default function Profile() {
    useTitle('我的资料');
    const { data, error, isLoading } = useApi(api.customer.getProfile);
    const [modifiable, setModifiable] = useState(false);

    if (isLoading) {
        return <Loading></Loading>
    }
    if (error) {
        return <FetchingError error={error} ></FetchingError>
    }
    
    const sex = data.sex === 1? '男': '女';
    return <Container>
        <Section title='基础资料' >
            <ModifiableRow modifiable={modifiable} label='姓名' >
                <Text>{data.realName}</Text>
                <input type="text" value={data.realName} />
            </ModifiableRow>
            <ModifiableRow modifiable={modifiable} label='联系电话' >
                <Text>{data.mobile}</Text>
                <input type="text" value={data.mobile} />
            </ModifiableRow>
            <ModifiableRow modifiable={modifiable} label='性别' >
                <Text>{sex}</Text>
                <input type="text" value={sex} />
            </ModifiableRow>
            <ModifiableRow modifiable={modifiable} label='出生日期' >
                <Text>{data.birthDate}</Text>
                <input type="text" value={data.birthDate} />
            </ModifiableRow>
            <ModifiableRow modifiable={modifiable} label='民族' >
                <Text>{data.perilRela}</Text>
                <input type="text" value={data.perilRela} />
            </ModifiableRow>
            <ModifiableRow modifiable={modifiable} label='籍贯' >
                <Text>{data.nativePlace}</Text>
                <input type="text" value={data.nativePlace} />
            </ModifiableRow>
        </Section>
        <Section title='技能资质' >
            <ModifiableRow modifiable={modifiable} label='学历' >
                <Text>{data.education}</Text>
                <input type="text" value={data.education} />
            </ModifiableRow>
            <ModifiableRow modifiable={modifiable} label='个人技能' >
                <Text>{data.skills}</Text>
                <input type="text" value={data.skills} />
            </ModifiableRow>

            <ModifiableRow modifiable={modifiable} label='资质证明' >
                <Text>{data.photos}</Text>
                <input type="text" value={data.photos} />
            </ModifiableRow>
        </Section>
        <Section title='紧急联系人' >
            <ModifiableRow modifiable={modifiable} label='姓名' >
                <Text>{data.perilName}</Text>
                <input type="text" value={data.perilName} />
            </ModifiableRow>
            <ModifiableRow modifiable={modifiable} label='联系电话' >
                <Text>{data.perilPhone}</Text>
                <input type="text" value={data.perilPhone} />
            </ModifiableRow>

            <ModifiableRow modifiable={modifiable} label='关系' >
                <Text>{data.perilRela}</Text>
                <input type="text" value={data.perilRela} />
            </ModifiableRow>
        </Section>
        <Info/>
        <div style={{padding: '0.5rem'}}>
            <Btn onClick={() => setModifiable(!modifiable)} >修改资料</Btn>
        </div>
    </Container>
}