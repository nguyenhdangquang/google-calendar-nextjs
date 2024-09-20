/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from "axios";
import { environment_config } from "./env-variables";

axios.defaults.baseURL = environment_config.API_ROOT;
axios.defaults.timeout = environment_config.REQUEST_TIMEOUT;
axios.defaults.headers.common["Accept"] = "application/json";
axios.interceptors.request.use(
  (config) => {
    const dataPersist = JSON.parse(
      localStorage.getItem("persist:auth") as string,
    );
    const auth = dataPersist?.accessToken.replaceAll('"', "");
    if (auth && config.headers) {
      config.headers["Authorization"] = `Bearer ${auth}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axios.interceptors.response.use(
  (response) => response.data,
  (error) =>
    Promise.reject(
      error.response || error.request || error.message || error.data,
    ),
);

const http = {
  setAuthorizationHeader(jwtAccessToken: string) {
    const headers = axios?.defaults?.headers as any;
    if (headers) {
      headers.Authorization = `Bearer ${jwtAccessToken}`;
    }
  },
  request(config: AxiosRequestConfig<any>) {
    return axios.request(config);
  },
  get(url: string, data?: any) {
    return axios.get(url, { params: data });
  },
  post(url: string, data?: any) {
    return axios.post(url, data);
  },
  put(url: string, data?: any) {
    return axios.put(url, data);
  },
  patch(url: string, data?: any) {
    return axios.patch(url, data);
  },
  delete(url: string) {
    return axios.delete(url);
  },
};

export default http;
