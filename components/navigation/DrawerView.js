import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contextHandler';
import { View, Text, Icon, Thumbnail, Button } from 'native-base';
import {
  TouchableNativeFeedback,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Modal from 'react-native-modal';
import DrawerButton from '../../custom/DrawerButton';
import { dynaSize } from '../../custom/helpers';
import loc from '../../localization/loc';

export default function DrawerView(props) {
  const {
    state,
    authContext: { signOut },
  } = useContext(AuthContext);
  const [prompt, setPrompt] = useState(false);
  const confirmSignOut = () => {
    props.navigation.closeDrawer();
    signOut()
      .then(() => {
        setPrompt(false);
        props.navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      })
      .catch(() => {
        setPrompt(false);
        props.navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      });
  };
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.header}>{loc('name')}</Text>
      <DrawerContentScrollView
        contentContainerStyle={styles.draweContainer}
        {...props}>
        {state.isSignedOut ? (
          <View style={styles.signOutContainer}>
            <Text style={styles.signOutMsg}>
              You are not Logged in, please{' '}
              <Text
                style={styles.txtBtn}
                onPress={() =>
                  props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                }>
                Log In
              </Text>{' '}
              or{' '}
              <Text
                style={styles.txtBtn}
                onPress={() =>
                  props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Register' }],
                  })
                }>
                Sign Up
              </Text>{' '}
              for a full-featured experience with Bissoy.
            </Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => props.navigation.navigate('Profile')}
              style={styles.loggedInContainer}>
              <Thumbnail
                square
                large
                style={styles.thumb}
                source={{
                  uri: `https://www.bissoy.com/${
                    state.user?.dp_62 || 'media/images/default/avatar.jpg'
                  }`,
                }}
              />
              <View style={styles.nameContainer}>
                <Text style={styles.username}>
                  {state.user?.full_name || state.user?.username}
                </Text>
                <Text style={styles.boldF9}>{state.user?.balance} BDT</Text>
                <Text style={styles.f9}>{state.user?.points} points</Text>
              </View>
            </TouchableOpacity>
            {props.state.routeNames.map((route, idx) => {
              if (
                route === 'Login' ||
                route === 'Register' ||
                route === 'FAQ' ||
                route === 'Modals'
              )
                return null;
              const focused = idx === props.state.index;
              let count = 0;
              let params = {};
              if (route === 'Notification') {
                count = state.notifCount;
              } else if (route === 'Chat') {
                count = state.msgCount;
              } else if (route === 'Profile') {
                params = {
                  screen: 'ProfilePage',
                  params: { user_id: state.user?.user_id },
                };
              }
              return (
                <DrawerButton
                  key={route}
                  onPress={() => props.navigation.navigate(route, params)}
                  focused={focused}
                  routeName={route}
                  count={count}
                />
              );
            })}
          </>
        )}
      </DrawerContentScrollView>

      {props.user ? (
        <>
          <TouchableNativeFeedback onPress={() => setPrompt(true)}>
            <View elevation={6} style={styles.footerBtn}>
              <Icon type="AntDesign" name="logout" style={styles.mh10} />
              <Text style={styles.logoutBtn}>{loc('logout')}</Text>
            </View>
          </TouchableNativeFeedback>
          <Modal isVisible={prompt}>
            <View style={styles.modalContainer}>
              <Text style={styles.confMsg}>{loc('logout_diag')}</Text>
              <View style={styles.modalBtnContainer}>
                <Button
                  transparent
                  small
                  style={styles.promptCancel}
                  onPress={() => setPrompt(false)}>
                  <Text style={styles.dodger}>{loc('cancel')}</Text>
                </Button>
                <Button
                  transparent
                  style={styles.m5}
                  onPress={() => confirmSignOut()}>
                  <Text style={styles.dangerText}>{loc('logout')}</Text>
                </Button>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <>
          <TouchableNativeFeedback
            onPress={() => props.navigation.navigate('Register')}>
            <View elevation={6} style={styles.footerBtn}>
              <Icon type="AntDesign" name="adduser" style={styles.mh10} />
              <Text style={styles.modalBtnTxt}>Sign Up</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={() =>
              props.navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
            }>
            <View elevation={6} style={styles.footerBtn}>
              <Icon type="AntDesign" name="login" style={styles.mh10} />
              <Text style={styles.modalBtnTxt}>Login</Text>
            </View>
          </TouchableNativeFeedback>
          {/* <TouchableNativeFeedback
            onPress={() => props.navigation.navigate('FAQ')}>
            <View elevation={6} style={styles.footerBtn}>
              <Icon
                type="MaterialCommunityIcons"
                name="account-question-outline"
                style={styles.mh10}
              />
              <Text style={styles.modalBtnTxt}>FAQ</Text>
            </View>
          </TouchableNativeFeedback> */}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#fafafa' },
  draweContainer: {
    flex: 1,
    backgroundColor: '#ededed',
    paddingTop: 0,
  },
  nameContainer: { flex: 1, marginLeft: 5 },
  header: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: dynaSize(22),
    color: '#fafafa',
    backgroundColor: '#16756d',
    fontWeight: 'bold',
  },
  thumb: { borderRadius: 5 },
  boldF9: {
    color: '#f9f9f9',
    fontWeight: 'bold',
  },
  f9: {
    color: '#f9f9f9',
  },
  m5: { margin: 5 },
  mh10: { marginHorizontal: 10 },
  promptCancel: { margin: 5, backgroundColor: '#99f1' },
  dangerText: { color: '#f55' },
  dodger: { color: 'dodgerblue' },
  signOutContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  footerBtnWrapper: {
    marginTop: 5,
  },
  signOutMsg: { textAlign: 'center', color: '#333', fontSize: 19 },
  txtBtn: {
    color: '#16756d',
    fontSize: dynaSize(18),
    fontWeight: 'bold',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
  loggedInContainer: {
    backgroundColor: '#16756d',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  username: {
    flexGrow: 1,
    fontSize: dynaSize(16),
    fontWeight: 'bold',
    color: '#f9f9f9',
  },
  footerBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    paddingVertical: 10,
    marginTop: 1,
  },
  confMsg: { margin: 10, fontSize: 17 },
  logoutBtn: { color: 'black', fontFamily: 'sans-serif-medium' },
  modalContainer: {
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: 100,
  },
  modalBtnContainer: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
  },
  modalBtnTxt: { color: 'black', fontFamily: 'sans-serif-medium' },
});
