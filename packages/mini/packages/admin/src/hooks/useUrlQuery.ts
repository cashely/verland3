import { useLocation } from "react-router-dom";

export default function useUrlQuery() {

    const { search } = useLocation();
    const type = new URLSearchParams(search)?.get('type')
    console.log(type, '===')
    return {
        isEditPage: type === 'edit',
        isDetailPage: type === 'detail'
    }
}