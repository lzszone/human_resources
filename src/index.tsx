import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components/macro';

const root = document.getElementById('root');

const Container = styled.div`
    color: red;
`;

class App extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return <Container>
            Hello World!
        </Container>
    }
}

ReactDOM.render(<App/>, root);