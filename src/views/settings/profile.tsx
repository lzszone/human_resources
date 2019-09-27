import React, { useState, useEffect, useContext, ChangeEvent } from 'react';
import styled from 'styled-components/macro';
import {CancelTokenSource} from 'axios';

import useTitle from '../../hooks/use_title';
import useStaticApi, { UseStaticApiResult } from '../../hooks/use_api';
import api, { CustomerProfile, DictData, CustomError } from '../../services/api';
import Input from '../../components/input';
import Container from '../../components/container';
import Section from '../../components/section';
import ModifiableRow from '../../components/modifiable_row';
import {FullWidthButton} from '../../components/buttons';
import Separator from '../../components/separator';
import ModalContext from '../../contexts/modal';
import WarningSrc from '../../../assets/warning.png';
import FetchingError from '../../components/fetching_error';
import Loading from '../../components/loading';

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

function Nation(props: {
    modifiable: boolean, 
    nations: DictData, 
    nationId: number, 
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void,
    isLoading: boolean,
    error: CustomError
}) {
    const {modifiable, nations, nationId, onChange, isLoading, error} = props;
    if(isLoading) {
        return <Loading/>
    }
    if(error) {
        return <FetchingError error={error} />
    }
    return <ModifiableRow modifiable={modifiable} label='民族' >
        <Text>{nationId === 0? 
            '未设置':
            nations.find(el => el.id === nationId).dataValue
        }</Text>
        <select onChange={onChange} >
            {nations.map(n => <option value={n.id} key={n.id} >{n.dataValue}</option>)}
        </select>
    </ModifiableRow>
}

export default function Profile() {
    useTitle('我的资料');
    const sources: Array<CancelTokenSource> = [];
    // useEffect(function ())
    const [ modifiable, setModifiable ] = useState(false);
    const [ realName, setRealName ] = useState('');
    const [ birthDate, setBirthDate ] = useState('');
    const [ nativePlace, setNativePlace ] = useState('');
    const [ perilPhone, setPerilPhone ] = useState('');
    const [ perilName, setPerilName ] = useState('');
    const [ perilRelaId, setPerilRelaId ] = useState(0);
    const [ nationId, setNationId ] = useState(0);
    const [ educationId, setEducationId ] = useState(0);
    const [ sex, setSex ] = useState<1|2>(1);
    const [ fetchingProfileError, setFetchingProfileError ] = useState(null);
    const [ isProfileLoading, setProfileLoading ] = useState(true);
    const [ skills, setSkills ] = useState<Array<string>>([]);
    const [ photos, setPhotos ] = useState<Array<string>>([]);
    const {
        data: nations, 
        error: fetchingNationsError, 
        isLoading: isNationsLoading
    } = useStaticApi(api.common.getDictData, 'nation');
    const {
        data: perilRelas, 
        error: fetchingPerilRelasError, 
        isLoading: isPerilRelasLoading
    } = useStaticApi(api.common.getDictData, 'perilRela');
    const {
        data: educations, 
        error: fetchingEducationsError, 
        isLoading: isEducationsLoading
    } = useStaticApi(api.common.getDictData, 'education');
    const Modal = useContext(ModalContext);

    useEffect(function () {
        const { promise, source } = api.customer.getProfile();
        sources.push(source);
        promise.then(data => {
            setProfileLoading(false);
            setBirthDate(data.birthDate);
            setEducationId(data.educationId);
            setNationId(data.nationId);
            setRealName(data.realName);
            setPerilName(data.perilName);
            setPerilPhone(data.perilPhone);
            setPerilRelaId(data.perilRelaId);
            setNativePlace(data.nativePlace);
            setSex(data.sex);
            setPhotos(data.photos);
            setSkills(data.skills)
        }).catch(e => {
            if(e.code !== -2001) {// 新用户还没有资料, 设置默认值, 正常渲染
                setFetchingProfileError(e)
            }
        })
        return sources.forEach(s => s.cancel())
    }, []);
    window["saveProfile"] = saveProfile;

    if(fetchingProfileError) { 
        return <FetchingError error={fetchingProfileError} />
    }

    if(isProfileLoading) {
        return <Loading/>
    }

    function saveProfile() {
        const {promise, source} = api.customer.submitProfile({
            nationId,
            realName,
            perilName,
            perilPhone,
            perilRelaId,
            nativePlace,
            educationId,
            sex,
            birthDate,
            skills,
            photos
        });
        setModifiable(false);
        promise.then(console.log).catch((e: Error) => Modal.show({
            title: '出错啦',
            message: e.message
        }));
        sources.push(source)
    }

    function modify() {
        if(fetchingEducationsError || fetchingNationsError || fetchingPerilRelasError) {
            return Modal.show({title: '出错啦', message: '选项卡加载失败, 请尝试刷新页面'})
        }
        if(isNationsLoading || isEducationsLoading || isProfileLoading) {
            return Modal.show({title: '数据加载中', message: '列表数据加载中, 请加载完成后再尝试修改'})
        }
        return setModifiable(true)
    }

    return <Container>
        <Section title='基础资料' >
            <ModifiableRow modifiable={modifiable} label='姓名' >
                <Text>{realName}</Text>
                <Input type="text" value={realName} onChange={e => setRealName(e.target.value)} />
            </ModifiableRow>
            <Separator/>
            <Separator/>
            <ModifiableRow modifiable={modifiable} label='性别' >
                <Text>{sex === 1? '男': '女'}</Text>
                <select value={sex === 1? '男': '女'} onChange={e => setSex(Number(e.target.value) as 1 | 2)} >
                    <option value="1">男</option>
                    <option value="2">女</option>
                </select>
            </ModifiableRow>
            <Separator/>
            {/* <ModifiableRow modifiable={modifiable} label='出生日期' >
                <Text>{birthDate}</Text>
                <Input type="text" value={birthDate} />
            </ModifiableRow> */}
            <Separator/>
            <Nation 
                modifiable={modifiable} error={fetchingNationsError} 
                nations={nations} nationId={nationId} 
                onChange={e => setNationId(Number(e.target.value))} 
                isLoading={isNationsLoading}
            />
            <Separator/>
            <ModifiableRow modifiable={modifiable} label='籍贯' >
                <Text>{nativePlace}</Text>
                <Input type="text" value={nativePlace} onChange={e => setNativePlace(e.target.value)} />
            </ModifiableRow>
        </Section>

        <Section title='技能资质' >
            <ModifiableRow modifiable={modifiable} label='学历' >
                <Text>{education}</Text>
                <Input type="text" value={education} onChange={e => setProfile({...profile, education: e.target.value})} />
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
                <Input type="text" value={perilName} onChange={e => setPerilName(e.target.value)} />
            </ModifiableRow>
            <Separator/>
            <ModifiableRow modifiable={modifiable} label='联系电话' >
                <Text>{perilPhone}</Text>
                <Input type="text" value={perilPhone} onChange={e => setPerilPhone(e.target.value)} />
            </ModifiableRow>
            <Separator/>
            <ModifiableRow modifiable={modifiable} label='关系' >
                <Text>{perilRela}</Text>
                <Input type="text" value={perilRela} onChange={e => setProfile({...profile, perilRela: e.target.value})} />
            </ModifiableRow>
        </Section>

        <Info/>
        {modifiable? 
            <FullWidthButton onClick={saveProfile} >保存资料</FullWidthButton>:
            <FullWidthButton onClick={modify} >修改资料</FullWidthButton>
        }
        
    </Container>
}