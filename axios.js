import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { Toast } from 'native-base';

const baseURL = 'https://www.bissoy.com/api/';
const axios = Axios.create({ baseURL });
axios.interceptors.request.use(
  async function (config) {
    try {
      const token = await AsyncStorage.getItem('@BISSOY_TOKEN');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.log(e.message || 'failed to load @BISSOY_TOKEN');
      throw e;
    }
    return config;
  },
  function (err) {
    let text = 'Error connecting to the server. Slow Internet?';
    if (err?.response?.status === 408 || err?.code === 'ECONNABORTED') {
      text = 'Connection timed out. CODE::ECONNABORTED';
    }
    Toast.show({
      text,
      type: 'danger',
    });
    console.log('object', err.message);
    return Promise.reject(err);
  }
);
export default axios;
