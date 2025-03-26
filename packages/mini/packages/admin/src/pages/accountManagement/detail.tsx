import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import DetailTemplate from '@/components/DetalTemplate'
import { detail } from '@/apis/modules/user'
import { detailItems } from './config'

const UserDetail = () => {

  const { id = '' } = useParams()
  const [info, setInfo] = useState<any>({})

  const getDetail = () => {
    detail(id).then((res) => {
      const { data = {} } = res
      setInfo(data)
    })
  }

  useEffect(() => {
    getDetail()
  }, [])

  return <DetailTemplate items={detailItems} detailInfo={info}></DetailTemplate>
}

export default UserDetail