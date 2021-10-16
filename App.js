import React from 'react';
import { LogBox ,BackHandler} from 'react-native';
import { StyleProvider, Root } from 'native-base';

import Boot from './Boot';
import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';
import { AuthContextProvider } from './contextHandler';
import { MenuProvider } from 'react-native-popup-menu';
import PushNotificationsManager from './PushNotificationsManager';

LogBox.ignoreLogs([
  'Warning: Failed prop type: Invalid prop `tabStyle` of type `array` supplied to `ScrollableTabBar`, expected `object`.',
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.',
]);

export default function App() {

  
  
  return (
    <Root>
      <StyleProvider style={getTheme(material)}>
        <AuthContextProvider>
          <PushNotificationsManager>
            <MenuProvider>
              <Boot />
            </MenuProvider>
          </PushNotificationsManager>
        </AuthContextProvider>
      </StyleProvider>
    </Root>
  );
}
