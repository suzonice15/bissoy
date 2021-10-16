import { CommonActions } from '@react-navigation/native';
import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, screen, params) {
  navigationRef.current?.navigate(name, { screen, params });
}
export function reset(screen, params) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Home', params: { screen, params } }],
    })
  );
}
