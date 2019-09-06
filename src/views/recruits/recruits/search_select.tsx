import React, { useState } from 'react';
import styled from 'styled-components/macro';
import delay from 'lodash/delay';

import { RecruitParam } from '../../../services/api';
import renderPage from '../../../components/render_page';
import Mask from '../../../components/mask';

const ContentContainer = styled.div`
    width: ${218 / 360}%;
    margin-left: 100%;
    transition: margin-left 0.3s;
`;

interface Props extends RecruitParam { 
    goto: (p: RecruitParam) => void, 
    searchProps: any,
    hide: () => void,
    visible: boolean
};

export default function SearchSelect({ goto, searchProps, hide, visible, ...restProps }: Props) {
    const { isLoading, error, data } = searchProps;
    restProps.recruitLabelItemIds ? undefined : restProps.recruitLabelItemIds = [];
    const [state, setState] = useState(restProps);
    const [inner, setInner] = useState

    function toggleItem(id: number) {
        const result = restProps.recruitLabelItemIds.map(str => Number(str));
        const index = result.indexOf(id);
        if (index > -1) {
            result.splice(index, 1)
        } else {
            result.push(id)
        }
        return result
    }

    return renderPage(error, isLoading, data, (data) => <Mask onClick={() => delay(hide, 300)} style={{zIndex: visible? 999: -1}} >
        <ContentContainer style={{marginLeft: visible? `${(360 - 218) / 360}%`: '100%'}} >
            {data.map(({ id, labelName, detailList }) =>
                <div key={id}>
                    <div>{labelName}</div>
                    <div>
                        {detailList.map(({ id, itemName }) =>
                            <button onClick={() => setState({ recruitLabelItemIds: toggleItem(id) })} key={id}>
                                {itemName}
                            </button>)
                        }
                    </div>
                </div>
            )}
            <div>
                <button onClick={() => goto({})}>重置</button>
                <button onClick={() => goto(state)}>确定</button>
            </div>
        </ContentContainer>
    </Mask>)
}