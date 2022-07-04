import aspida from "@aspida/axios";
import axios from "axios";

import api from "api/$api";

const baseURL = () => {
  switch (process.env.NEXT_PUBLIC_ENV) {
    case "prd":
      return process.env.NEXT_PUBLIC_PRD_API_URL;
    case "stg":
      return process.env.NEXT_PUBLIC_STG_API_URL;
    case "dev":
      return process.env.NEXT_PUBLIC_DEV_API_URL;
  }
};

const apiClient = axios.create({
  withCredentials: true,
  baseURL: baseURL(),
});
export const client = api(aspida(apiClient));
