import { useState, useEffect } from 'react';
import { detail } from '@/apis/modules/store';
import { useParams } from 'react-router';
import { detailItems } from './config';
import DetailTemplate from '@/components/DetalTemplate';

function Detail() {
  const params = useParams();
  const [info, setInfo] = useState<any>({});

  const getDetail = async () => {
    if (!params.id) return;
    const res = await detail(params.id as string);
    if (res?.data) {
      setInfo(res.data);
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <DetailTemplate items={detailItems} detailInfo={info}></DetailTemplate>
  );
}

export default Detail;
