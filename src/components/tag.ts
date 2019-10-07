import styled from 'styled-components/macro';

import theme from './theme';

const Tag = styled.button`
    height: ${20 / 14}rem;
    line-height: ${20 / 14}rem;
    padding: 0 ${10 / 14}rem;
    color: ${theme.blue};
    background-color: rgba(240, 240, 240, 1);
    border-radius: ${5 / 14}rem;
    margin: ${4 / 14}rem;
    vertical-align: middle;
    position: relative;
`;

export default Tag;