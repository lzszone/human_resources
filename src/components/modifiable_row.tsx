import React, {PropsWithChildren} from 'react';

export default function ModifiableRow(props: PropsWithChildren<{
    modifiable: boolean,
    label: string,
    children: [JSX.Element, JSX.Element]
}>) {
    const {
        modifiable, 
        children: [modify, display],
        label
    } = props;
    if(modifiable) {
        return <div>
        <label>{label}</label>
        {modify}
    </div>
    }
    return <div>
        <label>{label}</label>
        {display}
    </div>
}