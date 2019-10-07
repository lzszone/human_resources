import React from 'react';

import SquareContainer from './square_container';
import AbsoluteCenterImage from './abs_center_img';

export default function PreviewImage(props: {src: string}) {
    return <SquareContainer>
        <AbsoluteCenterImage src={props.src} />
    </SquareContainer>
}