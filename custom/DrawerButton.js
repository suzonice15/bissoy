import React from 'react';
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { Icon } from 'native-base';
import loc from '../localization/loc';
const routeProps = {
  Notification: {
    label: 'notif',
    icon: 'bells',
    aIcon: 'notification',
    type: 'AntDesign',
    hasCounter: true,
  },
  Chat: {
    label: 'call',
    icon: 'call-end',
    aIcon: 'call',
    type: 'MaterialIcons',
    hasCounter: true,
  },
  Profile: { label: 'prof', icon: 'barschart', type: 'AntDesign' },
  Home: { label: 'home', icon: 'home', type: 'AntDesign' },
  Ask: {
    label: 'ask',
    icon: 'comment-question-outline',
    aIcon: 'comment-question',
    type: 'MaterialCommunityIcons',
  },
  Blog: {
    label: 'write',
    icon: 'edit',
    type: 'AntDesign',
  },
  FAQ: {
    label: 'Help',
    icon: 'account-question-outline',
    type: 'MaterialCommunityIcons',
  },
  Settings: {
    label: 'settings',
    icon: 'settings',
    aIcon: 'settings-applications',
    type: 'MaterialIcons',
  },
};
export default function DrawerButton({
  routeName,
  focused,
  onPress,
  count = 0,
}) {
  return (
    <TouchableNativeFeedback onPress={() => onPress()}>
      <View
        style={{
          ...styles.footerBtn,
          fontWeigt: 'bold',
          backgroundColor: focused ? '#fefefe' : 'transparent',
        }}>
        <Icon
          type={routeProps[routeName].type}
          name={
            focused
              ? routeProps[routeName].aIcon || routeProps[routeName].icon
              : routeProps[routeName].icon
          }
          style={{
            color: focused ? '#16756d' : '#444',
            marginHorizontal: 10,
          }}
        />
        <Text
          style={[
            styles.footerBtnText,
            { color: focused ? '#16756d' : '#444' },
          ]}>
          {loc(routeProps[routeName].label)}
        </Text>
        {routeProps[routeName].hasCounter && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
              display: count > 0 ? 'flex' : 'none',
            }}>
            <Text
              style={{
                color: focused ? '#fff' : '#444',
                fontWeight: 'bold',
                backgroundColor: focused ? '#16756d' : '#fff',
                textAlign: 'center',
                minWidth: 25,
                borderRadius: 10,
              }}>
              {count}
            </Text>
          </View>
        )}
      </View>
    </TouchableNativeFeedback>
  );
}
const styles = StyleSheet.create({
  footerBtnWrapper: {
    marginTop: 5,
  },
  footerBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'aliceblue',
    paddingVertical: 10,
    marginTop: 1,
  },
  footerBtnText: {
    fontFamily: 'sans-serif-medium',
    fontSize: 16,
  },
});
