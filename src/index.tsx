import React, { useState, MouseEvent } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect } from 'react-router-dom';
import styled from 'styled-components/macro';
import 'normalize.css';
import '../assets/default.css';

import ModalContext, {Info} from './contexts/modal';
import RouterContext from './contexts/router';
import View from './views';
import Modal from './components/modal';
import Board from './components/board';
import { FullWidthButton } from './components/buttons';

const ErrorContainer = styled(Board)`
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
    function show(msg: Info) {
        return setInfo(msg)
    }
    function hide() {
        return setInfo(null)
    }
    function handleModalClick(e: MouseEvent<HTMLDivElement>) {
        setInfo(null)
    }

    return <BrowserRouter>
        {path?
            <Redirect to={path} />
            :
            null
        }
        
        {info? 
            <Modal onClick={handleModalClick} >
                <ErrorContainer>
                    <div>{info.title}<div>{info.message}</div></div>
                    <FullWidthButton style={{marginTop: '3rem'}} onClick={e => setInfo(null)} >确定</FullWidthButton>
                </ErrorContainer>
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