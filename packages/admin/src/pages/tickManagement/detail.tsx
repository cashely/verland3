import React, { useState, useEffect } from 'react';
import { Descriptions, Card } from 'antd';
import type { DescriptionsProps } from 'antd';
import { detail } from '@/apis/modules/ticket'
import { useParams } from 'react-router';
import { detailItems } from './config'

export default () => {

  const params = useParams()
  const [data, setData] = useState<DescriptionsProps['items']>([])

  const formateData = (obj: any) => {
    if (!obj?.id) return [];
    return detailItems.map(item => ({
      key: item.prop,
      label: item.label,
      children: obj[item.prop]
    }))

  }


  const getDetail = async () => {
    if (!params.id) return;
    const res = await detail(params.id)
    if (res?.data) {
      setData(formateData(res.data) || [])
    }
  }


  useEffect(() => {
    getDetail()
  }, [])
  return (
    <Card className='page-detail'>
      <Descriptions layout="vertical" items={data} />
    </Card>
  )
}