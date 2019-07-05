import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components/macro';
import HookedRouter from './components/hooked_router';

import View from './view';

const root = document.getElementById('root');

class App extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return <HookedRouter>
            Hello World!
            <View/>
        </HookedRouter>
    }
}

ReactDOM.render(<App/>, root);