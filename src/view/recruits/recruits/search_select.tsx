import React, {useState} from 'react';

import {RecruitParam} from '../../../service/api';
import Loading from '../../../components/loading';
import FetchingError from '../../../components/fetching_error';

interface Props extends RecruitParam {goto: (p: RecruitParam) => void, searchProps: any};

export default function SearchSelect({goto, searchProps, ...restProps}: Props) {
    const {isLoading, error, data} = searchProps;
    restProps.recruitLabelItemIds? undefined: restProps.recruitLabelItemIds = [];
    const [state, setState] = useState(restProps);

    function toggleItem(id: number) {
        const result = restProps.recruitLabelItemIds.map(str => Number(str));
        const index = result.indexOf(id);
        if(index > -1) {
            result.splice(index, 1)
        } else {
            result.push(id)
        }
        return result
    }

    if(isLoading) {
        return <Loading/>
    }
    if(error) {
        return <FetchingError error={error} />
    }
    return <div>
        {data.map(({id, labelName, detailList}) => 
            <div key={id}>
                <div>{labelName}</div>
                <div>
                    {detailList.map(({id, itemName}) => 
                        <button onClick={() => setState({recruitLabelItemIds: toggleItem(id)})} key={id}>
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
    </div>
}