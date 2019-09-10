import {createContext} from 'react';

export interface Info {title: string, message: string};

const ModalContext = createContext({
    show(msg: Info, callback?: () => any) {},
    hide() {}
});

export default ModalContext;