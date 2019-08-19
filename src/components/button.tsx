import styled from 'styled-components/macro';

import theme from './theme';

const Button = styled.button`
    background-color: ${theme.blue};
    color: white;
    border-radius: ${5 / 14}rem;
    border: none;
    cursor: pointer;
`;

export default Button;
