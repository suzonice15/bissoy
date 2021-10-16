import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import NetInfo from '@react-native-community/netinfo';
import axios from './axios';
import { verifyToken, logoutUser, saveToken, getLocale } from './asyncStorage';
import { Toast } from 'native-base';
import i18n from 'i18n-js';

const APP_VERSION = '1.0.4';

export const AuthContext = createContext();
export function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'LOAD_STARTED':
          return {
            ...prevState,
            isLoading: true,
          };
        case 'LOAD_FINISHED':
          return {
            ...prevState,
            isLoading: false,
          };
        case 'MUST_UPDATE':
          return {
            ...prevState,
            update: action.update,
          };
        case 'SIGNING_IN':
          return {
            ...prevState,
            isSigningIn: true,
          };
        case 'SIGNING_FAILED':
          return {
            ...prevState,
            isSigningIn: false,
          };
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            user: action.user,
            token: action.token,
            isSignedOut: false,
          };
        case 'SIGN_UP':
        case 'SIGN_IN':
          return {
            ...prevState,
            isSigningIn: false,
            isSignedOut: false,
            user: action.user,
            isLoading: false,
            token: action.token,
          };
        case 'GUEST_LOGIN':
          return {
            ...prevState,
            isSigningIn: false,
            isSignedOut: true,
            isGuest: true,
            isLoading: false,
            notifCount: 0,
            msgCount: 0,
          };
        case 'SESSION_EXPIRED':
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignedOut: true,
            user: null,
            isLoading: false,
            token: null,
            notifCount: 0,
            msgCount: 0,
            isConnected: true,
          };
        case 'NEW_NOTIF':
          return {
            ...prevState,
            notifCount: action.notifCount,
          };
        case 'NEW_MSG':
          return {
            ...prevState,
            msgCount: action.msgCount,
          };
        case 'CONN_STATUS':
          return {
            isConnected: action.isConnected,
          };
      }
    },
    {
      isLoading: true,
      isSignedOut: false,
      isGuest: false,
      isSigningIn: false,
      user: null,
      token: null,
      notifCount: 0,
      msgCount: 0,
      isConnected: true,
      update: false,
    }
  );
  async function bootstrapAsync() {
    dispatch({ type: 'LOAD_STARTED' });
    try {
      const { token, user } = await verifyToken();
      const locale = await getLocale();
      i18n.locale = locale;
      if (!!token && !!user) {
        dispatch({ type: 'RESTORE_TOKEN', token, user });
        dispatch({ type: 'LOAD_FINISHED' });
        updateNotifCounts();
      } else {
        dispatch({ type: 'SIGN_OUT' });
      }
    } catch (e) {
      console.log(e.message || 'verifyToken failed');
      dispatch({ type: 'SIGN_OUT' });
    }
    // try {
    //   const res = await axios.get('current_app_version');
    //   if (res.status === 200) {
    //     dispatch({ type: 'MUST_UPDATE', update: res.data !== APP_VERSION });
    //   }
    // } catch (e) {
    //   dispatch({ type: 'MUST_UPDATE', update: false });
    // }
  }
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((netInf) => {
      dispatch({
        type: 'CONN_STATUS',
        isConnected: netInf.isConnected,
      });
      if (netInf.isConnected) bootstrapAsync();
    });
    return () => {
      Toast.hide();
      unsubscribe();
    };
  }, []);
  function updateNotifCounts() {
    axios
      .get(`notifications/count`)
      .then((resp) => {
        if (resp.status === 200) {
          dispatch({ type: 'NEW_NOTIF', notifCount: resp.data });
        }
      })
      .catch(() => {
        dispatch({ type: 'NEW_NOTIF', notifCount: 0 });
      });
  }
  // function updateMsgCounts() {
  //   axios
  //     .get(`conversations/unread`)
  //     .then((resp) => {
  //       if (resp.status === 200) {
  //         dispatch({ type: 'NEW_MSG', msgCount: resp.data });
  //       }
  //     })
  //     .catch(() => {
  //       dispatch({ type: 'NEW_MSG', msgCount: 0 });
  //     });
  // }
  const authContext = useMemo(
    () => ({
      getToken: () => state.token || null,
      signIn: async (data) => {
        if (!state.isConnected) return;
        dispatch({ type: 'SIGNING_IN' });
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        axios
          .post('login', data, config)
          .then(async (res) => {
            if (res.status === 200) {
              Toast.show({
                text: 'Log in successful!',
                type: 'success',
                duration: 2000,
                onClose: () => Toast.hide(),
              });
              const {
                token,
                user: {
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
                },
              } = res.data;
              await saveToken(token);
              dispatch({
                type: 'SIGN_IN',
                token,
                user: {
                  user_id,
                  user_type_id,
                  username,
                  email,
                  dp_original,
                  dp_300,
                  dp_62,
                  points,
                  balance,
                  full_name: full_name?.full_name ?? username,
                  tagline: full_name?.tagline ?? '',
                },
              });
              return true;
            } else {
              dispatch({ type: 'SIGNING_FAILED' });
              Toast.show({
                text: 'Login failed!',
                type: 'danger',
                buttonText: 'Retry',
                duration: 2000,
              });
              return false;
            }
          })
          .catch((e) => {
            dispatch({ type: 'SIGNING_FAILED' });
            let text = 'Login Failed! ERR::S5XX';
            if (e.response?.status === 422) text = e.response?.data?.errors;
            Toast.show({
              text: e.message || text,
              type: 'danger',
              buttonText: 'Retry',
              duration: 4000,
            });
          });
      },
      guestLogin: () => {
        dispatch({ type: 'GUEST_LOGIN' });
      },
      signOut: async () => {
        await logoutUser();
        dispatch({ type: 'SIGN_OUT' });
        return new Promise.resolve(axios.get('logout'));
      },
      registerNewNotif: (newNotifcount) => {
        dispatch({ type: 'NEW_NOTIF', notifCount: newNotifcount });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={{ state, authContext }}>
      {children}
    </AuthContext.Provider>
  );
}
