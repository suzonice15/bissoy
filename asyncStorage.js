import AsyncStorage from '@react-native-community/async-storage';
import axios from './axios';

/*------
Set Data
--------*/
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem('@BISSOY_TOKEN', token);
    return true;
  } catch (e) {
    return false;
  }
};
export const setLocale = async (lang) => {
  try {
    await AsyncStorage.setItem('@BISSOY_LOCALE', lang);
    return true;
  } catch (e) {
    return false;
  }
};
/*------
Get Data
--------*/

export const verifyToken = async () => {
  try {
    const token = await AsyncStorage.getItem('@BISSOY_TOKEN');
    if (token !== null) {
      try {
        const res = await axios.get(`user`);
        if (res.status === 200) {
          const user = ({
            user_id,
            user_type_id,
            username,
            email,
            dp_original,
            dp_300,
            dp_62,
            points,
            balance,
            full_name,
          } = res.data);
          user.full_name = full_name?.full_name ?? username;
          user.tagline = full_name?.tagline ?? '';
          return { token, user };
        }
      } catch (e) {
        return { token: null, user: null };
      }
    }
    return { token: null, user: null };
  } catch (e) {
    return { token: null, user: null };
  }
};

export const getLocale = async () => {
  try {
    const lang = await AsyncStorage.getItem('@BISSOY_LOCALE');
    return lang;
  } catch (e) {
    return 'bn';
  }
};

/*---------
Remove Data
---------*/
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem('@BISSOY_TOKEN');
    return true;
  } catch (e) {
    return false;
  }
};
