import Cookies from 'js-cookie';

export const save = (key: string, item: string) => {
  Cookies.set(key, item);
};
export const remove = (key: string) => {
  Cookies.remove(key);
};

export const get = (key: string) => Cookies.get(key);
