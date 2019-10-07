import { useEffect } from 'react';
import qs from 'qs';

import api from '../services/api';

export default function useLogin() {
    useEffect(function () {
        // if(localStorage.getItem('profile')) {
        //     return 
        // } else {
            const { code, state } = qs.parse(location.search.replace('?', ''));
            const timestamp = new Date().valueOf().toString();


            api.wx.auth(code, timestamp, state, {transformRequest: [function(data, headers) {
                headers['Content-Type'] = 'application/json';
                const d = qs.parse(data);
                return JSON.stringify(d);
            }]}).promise
                .then(p => {
                    // const d = new Date(p.tokenExpireTime);
                    // document.cookie = `token=${escape(p.token)};expires=${d.toUTCString()};domain=520work.cn`
                })
                .catch(e => {
                    alert(e.stack.length)
                })
        // }
    }, [])
}