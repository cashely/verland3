import React, { useState, forwardRef, useEffect } from'react';
import { Input } from 'antd';
import { delay } from 'lodash-es';

const NewTreeInput: React.FC<any> = forwardRef((props: {
    onChange?: (e: any) => void;
    value?: string;
    onBlur: React.FocusEventHandler<HTMLInputElement>
}, ref: React.Ref<any>) => {
    const [value, setValue] = useState<string | undefined>('');
    const onHandleChange = (e: any) => {
        const v = e.target.value;
        setValue(v);
        delay(() =>  props.onChange && props.onChange(v), 300);
    }

    useEffect(() => {
        setValue(props.value);
    }, []);
    return (
        <Input
            ref={ref}
            size='small'
            value={value}
            onChange={onHandleChange}
            onBlur={props.onBlur}
            className='border-none focus:shadow-none focus:border-none bg-gray-200 hover:bg-gray-200 focus:bg-gray-200 rounded-sm text-sm px-2 py-1'
        />
    )
})

export default NewTreeInput;