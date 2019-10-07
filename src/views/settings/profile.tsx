import React, { useState, useEffect, useContext, ChangeEvent, useRef } from 'react';
import styled from 'styled-components/macro';
import axios, {CancelTokenSource} from 'axios';

import useTitle from '../../hooks/use_title';
import api, { CustomerProfile, DictData, CustomError, ProfileUploader } from '../../services/api';
import Input from '../../components/input';
import Container from '../../components/container';
import Section from '../../components/section';
import ModifiableRow from '../../components/modifiable_row';
import Button, {FullWidthButton} from '../../components/buttons';
import Separator from '../../components/separator';
import ModalContext from '../../contexts/modal';
import FetchingError from '../../components/fetching_error';
import Loading from '../../components/loading';
import Modal from '../../components/modal';
import theme from '../../components/theme';
import addSrc from '../../../assets/add.png';
import deleteSrc from '../../../assets/delete.png';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import Row from '../../components/row';
import RowHeader from '../../components/row_header';
import RemovableImg from '../../components/removable_img';
import Info from '../../components/info';
import Text from '../../components/row_text';
import PaddingWrapper from '../../components/p_33_padding_wrapper';
import ElementWrapper from '../../components/p_33_element_wrapper';
import PreviewImage from '../../components/preview_image';
import TagContainer from '../../components/tag_container';
import SkillButton from '../../components/tag';

const AddSkillContainer = styled.div`
    background-color: white;
    position: absolute;
    width: 60%;
    height: 5rem;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    padding: 2rem;
    border-radius: 0.5rem;
    overflow: hidden;
`;

const AddSkillInput = styled.input`
    width: fill-available;
    margin: auto;
    line-height: 2rem;
    border-radius: 0.3rem;
    border: 1px solid grey;
`;

const BottomDiv = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3rem;
    width: fill-available;
`;

const B = styled(Button)`
    display: block;
    bottom: 0;
    width: 50%;
    height: 100%;
    font-weight: bold;
    position: absolute;
    border-radius: 0;
`;

const EnsureButton = styled(B)`
    left: 0;
`;

const CancelButton = styled(B)`
    background-color: silver;
    right: 0;
`;

const AddImg = styled.img`
    height: ${16 / 14}rem;
    margin: ${2 / 14}rem auto auto auto;
`;

const Delete = styled.img`
    cursor: pointer;
    border-radius: 50%;
    height: ${12 / 14}rem;
    width: ${12 / 14}rem;
    position: absolute;
    top: -${6 / 14}rem;
    right: -${6 / 14}rem;
    background-color: #999999;
`;

const AddButton = styled.button`
    display: block;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    background-image: url("${addSrc}");
    background-repeat: no-repeat;
    background-size: 50%;
    background-position: center;
    background-color: ${theme.grey};
    border-radius: ${8 / 14}rem;
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
        <select onChange={onChange} value={id.toString()} >
            {data.map((n, i) => <option value={n.id} key={n.id} defaultChecked={i === 0} >{n.dataValue}</option>)}
        </select>
    </ModifiableRow>
}

function Skill({children, modifiable, onClick}: {children: string, modifiable: boolean, onClick: () => void}) {
    return <SkillButton>
        {children}
        {modifiable? 
            <Delete src={deleteSrc} onClick={onClick} />:
            null
        }
    </SkillButton>
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

    function handleRemove(id: number) {
        skills.splice(id, 1);
        onChange([...skills])
    }

    return <ModifiableRow label='个人技能' modifiable={modifiable} >
        <TagContainer>{skills.map((s, i) => <Skill modifiable={modifiable} key={s} onClick={() => handleRemove(i)} >{s}</Skill>)}</TagContainer>
        <TagContainer>
            {typing?
                <Modal>
                    <AddSkillContainer>
                        <div>
                            <AddSkillInput type="text" onChange={e => setCurrentSkill(e.target.value)} placeholder='请输入技能名称' />
                        </div>
                        <BottomDiv>
                            <EnsureButton onClick={addSkill} >确定</EnsureButton>
                            <CancelButton onClick={cancel} >取消</CancelButton>
                        </BottomDiv>
                    </AddSkillContainer>
                </Modal>:
                null
            }
            {skills.map((s, i) => <Skill modifiable={modifiable} key={s} onClick={() => handleRemove(i)} >{s}</Skill>)}
            <SkillButton onClick={handleAddClick} ><AddImg src={addSrc} /></SkillButton>
        </TagContainer>
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
    const [ nations, setNations ] = useState<DictData>([]);
    const [ isNationsLoading, setIsNationsLoading ] = useState(true);
    const [ fetchingNationsError, setFetchingNationsError ] = useState(null);
    const [ perilRelas, setPerilRelas ] = useState<DictData>([]);
    const [ isPerilRelasLoading, setIsPerilRelasLoading ] = useState(true);
    const [ fetchingPerilRelasError, setFetchingPerilRelasError ] = useState(null);
    const [ educations, setEducations ] = useState<DictData>([]);
    const [ isEducationsLoading, setIsEducationsLoading ] = useState(true);
    const [ fetchingEducationsError, setFetchingEducationsError ] = useState(null);

    // current user input state
    const [ modifiable, setModifiable ] = useState(false);
    const [ realName, setRealName ] = useState('');
    const [ birthDate, setBirthDate ] = useState(new Date());
    const [ nativePlace, setNativePlace ] = useState('');
    const [ perilPhone, setPerilPhone ] = useState('');
    const [ perilName, setPerilName ] = useState('');
    const [ perilRelaId, setPerilRelaId ] = useState(0);
    const [ nationId, setNationId ] = useState(0);
    const [ educationId, setEducationId ] = useState(0);
    const [ sex, setSex ] = useState<1|2>(1);
    const [ skills, setSkills ] = useState<Array<string>>([]);
    const [ photos, setPhotos ] = useState<Array<ProfileUploader>>([]);
    
    // uploader
    const uploaderRef = useRef<HTMLInputElement>(null);

    // cancellation, and set profile data with server response.
    useEffect(function () {
        const { promise, source } = api.customer.getProfile();
        sources.push(source);
        promise.then(data => {
            setProfileLoading(false);
            const ps = data.photos? data.photos.map(src => {
                const pu = new ProfileUploader(null);
                pu.savePath = pu.previewPath = src;
                pu.state = 'uploaded';
                return pu
            }): [];
            setBirthDate(data.birthDate === ''? moment().toDate(): moment(data.birthDate).toDate());
            setEducationId(data.educationId);
            setNationId(data.nationId);
            setRealName(data.realName);
            setPerilName(data.perilName);
            setPerilPhone(data.perilPhone);
            setPerilRelaId(data.perilRelaId);
            setNativePlace(data.nativePlace);
            setSex(data.sex);
            setPhotos(ps);
            setSkills(data.skills || [])
        }).catch(e => {
            if(e.code === -2001) { // 新用户还没有资料, 设置默认值, 正常渲染
                return setProfileLoading(false);
            }
            // 出错了
            return setFetchingProfileError(e)
        });

        const n = api.common.getDictData('nation');
        sources.push(n.source);
        n.promise
            .then(d => {
                setNations(d);
                setIsNationsLoading(false);
                return setNationId(d[0].id)
            })
            .catch(setFetchingNationsError);

        const e = api.common.getDictData('education');
        sources.push(e.source);
        e.promise
            .then(e => {
                setEducations(e);
                setIsEducationsLoading(false);
                return setEducationId(e[0].id)
            })
            .catch(setFetchingEducationsError);

        const p = api.common.getDictData('perilRela');
        sources.push(p.source);
        p.promise
            .then(p => {
                setPerilRelas(p);
                setIsPerilRelasLoading(false);
                setPerilRelaId(p[0].id)
            })
            .catch(setFetchingPerilRelasError);

        // cancellation
        return () => sources.forEach(s => s.cancel())
    }, []);

    if(fetchingProfileError) { 
        return <FetchingError error={fetchingProfileError} />
    }

    if(isProfileLoading) {
        return <Loading/>
    }

    function del(img: ProfileUploader) {
        setPhotos(photos.filter(e => e !== img))
    }

    function add(file: File) {
        const img = new ProfileUploader(file);
        const es = photos.concat(img);
        setPhotos(es);
        const { source, promise } = img.upload();
        sources.push(source);
        promise
            .then(() => setPhotos([...es]))
            .catch(e => {
                if(!axios.isCancel(e)) {

                    setPhotos([...photos]);
                    Modal.show({
                        title: '出错啦: ',
                        message: e.message
                    })
                }
            })
    }

    function saveProfile() {
        const bd = moment(birthDate).format('YYYY-MM-DD');
        const rq = {
            nationId,
            realName,
            perilName,
            perilPhone,
            perilRelaId,
            nativePlace,
            educationId,
            sex,
            birthDate: bd,
            skills,
            photos: photos.map(p => p.previewPath)
        };
        const {promise, source} = api.customer.submitProfile(rq);
        setModifiable(false);
        promise.then(() => Modal.show({title: '操作成功', message: '已修改'})).catch((e: Error) => Modal.show({
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
        <input type="file" hidden ref={uploaderRef} onChange={e => add(e.target.files[0])} />
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
            <Row>
                <RowHeader>出生日期</RowHeader>
                {/*
                // @ts-ignore WTF about the syntax */}
                <DatePicker value={birthDate} locale='zh-CN' disabled={!modifiable} className='dp-rewrite' disableCalendar={!modifiable} clearIcon={null} />
            </Row>
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
            <Separator/>
            <ModifiableRow modifiable={modifiable} label='资质证明' >
                <PaddingWrapper>
                    {photos.map(p => 
                        <ElementWrapper key={p.previewPath} >
                            <PreviewImage src={p.previewPath} />
                        </ElementWrapper>
                    )}
                </PaddingWrapper>
                <PaddingWrapper>
                    {photos.map(img => 
                        <ElementWrapper key={img.previewPath} >
                            <RemovableImg url={img.previewPath} isUploading={img.state === 'uploading'} onDelete={e => del(img)} />
                        </ElementWrapper> 
                    )}
                    <ElementWrapper><AddButton onClick={e => uploaderRef.current.click()} /></ElementWrapper> 
                </PaddingWrapper>
            </ModifiableRow>
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