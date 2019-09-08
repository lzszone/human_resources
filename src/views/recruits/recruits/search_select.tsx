import React, { useState } from 'react';
import styled from 'styled-components/macro';

import { RecruitParam } from '../../../services/api';
import renderPage from '../../../components/render_page';
import Mask from '../../../components/mask';

const ContentContainer = styled.div`
    width: ${218 / 360 * 100}%;
    margin-left: 100%;
    transition: margin-left 0.3s;
    background-color: white;
    height: 100%;
    position: relative;
`;

interface Props extends RecruitParam { 
    goto: (p: RecruitParam) => void, 
    searchProps: any,
    onMaskClick: () => void,
    maskV: boolean,
    contentV: boolean
};

const Reset = styled.button`
    color: #666666;
    background-color: #F0F0F0;
    font-size: ${16 / 14}rem;
    height: ${56 / 14}rem;
    width: 50%;
    position: absolute;
    bottom: 0;
    left: 0;
`;

const Ensure = styled.button`
    color: white;
    background-color: #4A90E2;
    font-size: ${16 / 14}rem;
    height: ${56 / 14}rem;
    width: 50%;
    position: absolute;
    bottom: 0;
    right: 0;
`;

const Title = styled.div`
    color: #666666;
    background-color: #F0F0F0;
    padding: ${5 / 14}rem;
`;

const SectionTitle = styled.div`
    margin: ${8 / 14}rem ${5 / 14}rem ${5 / 14}rem ${5 / 14}rem;
`;

const FilterContainer = styled.div`
    padding: ${2.5 / 14}rem;
`;

const Filter = styled.button<{selected: boolean}>`
    width: 100%;
    text-align: center;
    padding: 1rem 0;
    color: ${({selected}) => selected? '#4A90E2': 'initial'};
    border: ${({selected}) => selected? '#4A90E2 solid 1px': 'none'};
    font-size: ${12 / 14}rem;
    border-radius: ${5 / 14}rem;
`;

const FilterWrapper = styled.div`
    display: inline-block;
    width: 32%;
    padding: ${2.5 / 14}rem;
    vertical-align: middle;
`;

export default function SearchSelect({ goto, searchProps, onMaskClick, maskV, contentV, ...restProps }: Props) {
    const { isLoading, error, data } = searchProps;
    restProps.recruitLabelItemIds ? undefined : restProps.recruitLabelItemIds = [];
    const [state, setState] = useState(restProps);

    function toggleItem(id: number) {
        const result = state.recruitLabelItemIds.map(str => Number(str));
        const index = result.indexOf(id);
        if (index > -1) {
            result.splice(index, 1)
        } else {
            result.push(id)
        }
        return result
    }

    function handleResetClick() {
        onMaskClick();
        return goto({})
    }

    function handleEnsureClick() {
        onMaskClick();
        return goto(state)
    }

    return renderPage(error, isLoading, data, (data) => <Mask onClick={onMaskClick} style={{zIndex: maskV? 999: -1}} >
        <ContentContainer style={{marginLeft: contentV? `${(360 - 218) / 360 * 100}%`: '100%'}} onClick={e => e.stopPropagation()} >
            <Title>筛选</Title>
            {data.map(({ id, labelName, detailList }) =>
                <div key={id}>
                    <SectionTitle>{labelName}</SectionTitle>
                    <FilterContainer>
                        {detailList.map(({ id, itemName }) => <FilterWrapper key={id} >
                            <Filter onClick={() => setState({ recruitLabelItemIds: toggleItem(id) })} selected={Boolean(state.recruitLabelItemIds.find(el => el == id))} >
                                {itemName}
                            </Filter>
                        </FilterWrapper>)
                        }
                    </FilterContainer>
                </div>
            )}
            <div>
                <Reset onClick={handleResetClick}>重置</Reset>
                <Ensure onClick={handleEnsureClick}>确定</Ensure>
            </div>
        </ContentContainer>
    </Mask>)
}