import {useContext} from 'react';

import RouterContext from '../contexts/router';

export default function useRouter() {
    return useContext(RouterContext)
}