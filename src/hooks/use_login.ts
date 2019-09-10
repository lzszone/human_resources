import { useEffect } from 'react';
import qs from 'qs';

import api from '../services/api';

export default function useLogin() {
    useEffect(function () {
        if(localStorage.getItem('profile')) {
            return 
        } else {
            const { code, state } = qs.parse(location.search.replace('?', ''));
            const timestamp = new Date().valueOf().toString();


            api.wx.auth(code, timestamp, state).promise
                .then(p => {
                    localStorage.setItem('profile', JSON.stringify(p))
                })
                .catch(e => {
                //     alert(`code: ${code}\n state: ${state}\n timestamp: ${timestamp}`);
                //     alert(e.message)
                })
        }
    }, [])
}