export interface RestBaseResponse<T> {
  message: string;
  data?: T;
}
