import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import View from './view';

const root = document.getElementById('root');

function App() {
    return <BrowserRouter>
        Hello World!
        <View/>
    </BrowserRouter>
}

ReactDOM.render(<App/>, root);