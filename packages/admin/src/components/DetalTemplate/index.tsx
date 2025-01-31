import { useState } from "react";
import {  Descriptions } from 'antd';

export default function DetailTemplate(props: any) {
    const {items} = props
    return (
        <section className={'bg-white rounded p-[16px] pt-[20px]'}>
           
           <Descriptions title="User Info" items={items} />
           </section>
    );
}
