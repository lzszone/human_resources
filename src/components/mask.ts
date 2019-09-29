import styled from 'styled-components/macro';

const Mask = styled.div`
    position: fixed;
    background-color: rgba(0, 0, 0, 0.5);
    height: 100%;
    width: 100%;
    z-index: 999;
    overflow: hidden;
    top: 0;
    left: 0;
    cursor: pointer;
`;

export default Mask;