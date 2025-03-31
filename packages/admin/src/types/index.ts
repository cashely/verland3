export interface PageData<T> {
  pageNo: number;
  pageSize: number;
  total: number;
  data: T[];
}