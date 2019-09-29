import React, { useState, MouseEvent, useRef } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect } from 'react-router-dom';
import styled from 'styled-components/macro';
import 'normalize.css';
import '../assets/default.css';
import { delay } from 'lodash';

import ModalContext, {Info} from './contexts/modal';
import RouterContext from './contexts/router';
import View from './views';
import Modal from './components/modal';
import Board from './components/board';
import { FullWidthButton } from './components/buttons';

const InfoContainer = styled(Board)`
    position: absolute;
    width: 50%;
    height: 10rem;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    padding: 2rem;
    border-radius: 0.5rem;
`;

const root = document.getElementById('root');

function App() {
    
    const [path, setPath] = useState('');
    function redirect(path: string) {
        return setPath(path)
    }

    const [info, setInfo] = useState<Info | null>(null);
    const callbackRef = useRef(null);
    function show(msg: Info, callback?: () => any) {
        callbackRef.current = callback;
        return setInfo(msg)
    }
    function hide() {
        setInfo(null);
        if(callbackRef.current) {
            delay(() => {
                callbackRef.current();
                callbackRef.current = null
            }, 100)
        }
    }
    function closeModal(e: MouseEvent<HTMLElement>) {
        if(e.target === e.currentTarget) {
            return hide()
        }
    }

    return <BrowserRouter>
        {path?
            <Redirect to={path} />
            :
            null
        }
        
        {info? 
            <Modal onClick={closeModal} >
                <InfoContainer>
                    <div>{info.title}<div>{info.message}</div></div>
                    <FullWidthButton style={{marginTop: '3rem'}} onClick={closeModal} >确定</FullWidthButton>
                </InfoContainer>
            </Modal>
            :
            null
        }
        <ModalContext.Provider value={{show, hide}} >
            <RouterContext.Provider value={{redirect}} >
                <View />
            </RouterContext.Provider>
        </ModalContext.Provider>
    </BrowserRouter>
}

ReactDOM.render(<App />, root);