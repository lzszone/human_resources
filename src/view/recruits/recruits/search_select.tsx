import React, {useState} from 'react';

import api, {RecruitParam} from '../../../api';
import useApi from '../../../hooks/use_api';

interface Props extends RecruitParam {redirect: (p: RecruitParam) => void, searchProps: any};

export default function SearchSelect({redirect, searchProps, ...restProps}: Props) {
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
        return <div>Loading...</div>
    }
    if(error) {
        return null
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
            <button onClick={() => redirect(state)}>确定</button>
        </div>
    </div>
}