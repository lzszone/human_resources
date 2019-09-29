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
import Modal from '../../components/modal';

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

const AddSkillContainer = styled.div`
    background-color: white;
    position: absolute;
    width: 60%;
    height: 10rem;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    padding: 2rem;
    border-radius: 0.5rem;
`;

const AddSkillInput = styled.input`
    width: 100%;
    margin: auto;
`;

const BottomDiv = styled.div`
    position: absolute;
    bottom: 0;
`;

function Selector(props: {
    modifiable: boolean, 
    data: DictData, 
    id: number, 
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void,
    isLoading: boolean,
    error: CustomError,
    label: string
}) {
    const {modifiable, data, id, onChange, isLoading, error, label} = props;
    if(isLoading) {
        return <Loading/>
    }
    if(error) {
        return <FetchingError error={error} />
    }
    return <ModifiableRow modifiable={modifiable} label={label} >
        <Text>{id === 0? 
            '未设置':
            data.find(el => el.id === id).dataValue
        }</Text>
        <select onChange={onChange} >
            {data.map(n => <option value={n.id} key={n.id} >{n.dataValue}</option>)}
        </select>
    </ModifiableRow>
}

function Skill({children, modifiable}: {children: string, modifiable: boolean}) {
    return <span>{children}</span>
}

function Skills(props: {
    skills: Array<string>,
    onChange: (d: Array<string>) => void,
    modifiable: boolean
}) {
    const {skills, onChange, modifiable} = props;
    const [typing, setTyping] = useState(false);
    const [currentSkill, setCurrentSkill] = useState('');

    function addSkill() {
        setTyping(false);
        onChange([...skills, currentSkill])
        return setCurrentSkill('')
    }

    function handleAddClick() {
        return setTyping(true)
    }

    function cancel() {
        setCurrentSkill('')
        return setTyping(false)
    }

    return <ModifiableRow label='个人技能' modifiable={modifiable} >
        <div>{skills.map(s => <Skill modifiable={modifiable} key={s} >{s}</Skill>)}</div>
        <div>
            {typing?
                <Modal>
                    <AddSkillContainer>
                        <div>
                            <AddSkillInput type="text" onChange={e => setCurrentSkill(e.target.value)} placeholder='请输入技能名称' />
                        </div>
                        <BottomDiv>
                            <button onClick={addSkill} >确定</button>
                            <button onClick={cancel} >取消</button>
                        </BottomDiv>
                    </AddSkillContainer>
                </Modal>:
                null
            }
            {skills.map(s => <Skill modifiable={modifiable} key={s} >{s}</Skill>)}
            <button onClick={handleAddClick} >+</button>
        </div>
    </ModifiableRow>
}

export default function Profile() {
    useTitle('我的资料');
    const Modal = useContext(ModalContext);

    // for cancellation
    const sources: Array<CancelTokenSource> = []; 

    // initial profile fetching
    const [ fetchingProfileError, setFetchingProfileError ] = useState(null); 
    const [ isProfileLoading, setProfileLoading ] = useState(true); 

    // current user input state
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
    const [ skills, setSkills ] = useState<Array<string>>([]);
    const [ photos, setPhotos ] = useState<Array<string>>([]);

    // selector data fetching
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

    // cancellation, and set profile data with server response.
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
            if(e.code === -2001) { // 新用户还没有资料, 设置默认值, 正常渲染
                return setProfileLoading(false);
            }
            // 出错了
            return setFetchingProfileError(e)
        })
        // cancellation
        return () => sources.forEach(s => s.cancel())
    }, []);

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
            <Selector 
                modifiable={modifiable} error={fetchingNationsError} 
                data={nations} id={nationId} 
                onChange={e => setNationId(Number(e.target.value))} 
                isLoading={isNationsLoading} label='民族'
            />
            <Separator/>
            <ModifiableRow modifiable={modifiable} label='籍贯' >
                <Text>{nativePlace}</Text>
                <Input type="text" value={nativePlace} onChange={e => setNativePlace(e.target.value)} />
            </ModifiableRow> 
        </Section>

        <Section title='技能资质' >
            <Selector modifiable={modifiable} label='学历' data={educations}
                id={educationId} error={fetchingEducationsError}
                onChange={e => setEducationId(Number(e.target.value))}
                isLoading={isEducationsLoading}
            />
            <Separator/>
            <Skills skills={skills} onChange={skills => setSkills(skills)} modifiable={modifiable} />
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
            <Selector modifiable={modifiable} label='关系' data={perilRelas}
                id={perilRelaId} error={fetchingPerilRelasError}
                onChange={e => setPerilRelaId(Number(e.target.value))}
                isLoading={isPerilRelasLoading} 
            />
        </Section>

        <Info/>
        {modifiable? 
            <FullWidthButton onClick={saveProfile} >保存资料</FullWidthButton>:
            <FullWidthButton onClick={modify} >修改资料</FullWidthButton>
        }
        
    </Container>
}