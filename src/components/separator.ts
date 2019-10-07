import styled from 'styled-components';
import theme from './theme';

const Separator = styled.div`
    position: relative;
    ::after {
        content: '';
        bottom: 0;
        left: ${16 / 14}rem;
        right: ${16 / 14}rem;
        height: 1px;
        background-color: ${theme.grey};
        position: absolute;
    };
`;

export default Separator;