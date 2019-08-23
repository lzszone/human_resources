import styled from 'styled-components';
import theme from './theme';

const Separator = styled.div`
    height: ${1 / 14}rem;
    position: relative;
    ::after {
        content: '';
        bottom: 0;
        left: ${16 / 14}rem;
        right: ${16 / 14}rem;
        height: 100%;
        background-color: ${theme.grey};
        position: absolute;
    };
`;

export default Separator;