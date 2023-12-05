import axios from 'axios';

const env = import.meta.env;

const getDefaultHeaders = async () => {
  return {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': env.VITE_NS_OCP_APIM_KEY,
  };
};

const getHostUrl = () => {
  return env.VITE_NS_OCP_API_ENDPOINT;
};

export const apiGet = async <T>(
  url: string,
  params: Record<string, string | number> = {},
) => {
  const response = await axios.get<T>(`${getHostUrl()}${url}`, {
    headers: await getDefaultHeaders(),
    params: { ...params, lang: 'en' },
  });

  return response.data;
};

export const apiPost = async <T>(url: string, data: never) => {
  const response = await axios.post<T>(url, data, {
    headers: await getDefaultHeaders(),
  });

  return response.data;
};

export const apiPut = async <T>(url: string, data: never) => {
  const response = await axios.put<T>(url, data, {
    headers: await getDefaultHeaders(),
  });

  return response.data;
};

export const apiDelete = async <T>(url: string) => {
  const response = await axios.delete<T>(url, {
    headers: await getDefaultHeaders(),
  });

  return response.data;
};
