import React, {useState} from 'react';

import api, {RecruitParam} from '../../../api';
import useApi from '../../../hooks/use_api';

interface Props extends RecruitParam {redirect: (p: RecruitParam) => void};

function SearchSelect({redirect, ...restProps}: Props) {
    const {isLoading, error, data} = useApi(api.recruit.getSearchParams);
    const [state, setState] = useState(restProps);

    if(isLoading) {
        return <div>Loading...</div>
    }
    if(error) {
        return null
    }
    return <div>
        {data.map(({id, labelName}) => <button onClick={setState({})}>
            {labelName}
        </button>)}
    </div>
}