import { useState, useEffect } from 'react';
import type { DescriptionsProps } from 'antd';
import { detail } from '@/apis/modules/bookGood'
import { useParams } from 'react-router';
import { detailItems } from './config'
import DetailTemplate from '@/components/DetalTemplate';

const Detail = () => {

  const params = useParams()
  const [info, setInfo] = useState<any>({})

  const getDetail = async () => {
    if (!params.id) return;
    const res = await detail(params.id)
    if (res?.data) {
      setInfo(res.data)
    }
  }

  useEffect(() => {
    getDetail()
  }, [])

  return (
    <DetailTemplate items={detailItems} detailInfo={info}></DetailTemplate>
    // <Card className='page-detail'>
    //   <Descriptions layout="vertical" />
    // </Card>
  )
}

export default Detail