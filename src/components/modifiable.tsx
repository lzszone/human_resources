import React, {JSXElementConstructor, Fragment} from 'react';

export interface ModifiableComponentProps<T> {
    modifiable: boolean,
    Display: JSXElementConstructor<T>,
    Modify: JSXElementConstructor<T>,
    renderProps: T
};

export default function Modifiable<T>(props: ModifiableComponentProps<T>) {
    const {modifiable, Modify, Display, renderProps} = props;
    if(modifiable) {
        return <Modify {...renderProps} />
    }
    return <Display {...renderProps} />
}