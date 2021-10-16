import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  TouchableNativeFeedback,
  TextInput,
} from 'react-native';
import { Item, Icon, Header } from 'native-base';
import { AuthContext } from '../../contextHandler';
import { dynaSize } from '../../custom/helpers';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
const { width, height } = Dimensions.get('window');

const mailReg = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function Login({ navigation }) {
  const {
    state: { isSigningIn },
    authContext: { signIn, guestLogin },
  } = useContext(AuthContext);
  let emailInput = useRef();
  let passInput = useRef();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const [hidePass, setHidePass] = useState(true);
  useEffect(() => {
    setLoggingIn(false);
    Keyboard.addListener('keyboardWillShow', () => {
      setKeyboardShowing(true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardShowing(false);
    });
    return () => {
      Keyboard.removeAllListeners('keyboardWillShow');
      Keyboard.removeAllListeners('keyboardDidHide');
      setEmail('');
      setPassword('');
      setEmailError(false);
      setPasswordError(false);
      setLoggingIn(false);
    };
  }, []);
  useEffect(() => {
    if (emailError) setEmailError(false);
    if (passwordError) setPasswordError(false);
  }, [email, password]);

  useEffect(() => {
    setLoggingIn(isSigningIn);
  }, [isSigningIn]);

  async function handleLogin() {
    Keyboard.dismiss();
    if (loggingIn) {
      setLoggingIn(false);
    }
    setLoggingIn(true);
    if (email.length < 5 || !mailReg.test(email)) {
      setEmailError(true);
      setLoggingIn(false);
      return;
    }
    if (password.length < 4) {
      setPasswordError(true);
      setLoggingIn(false);
      return;
    }
    if (!emailError && !passwordError) {
      const data = JSON.stringify({ email, password });
      await signIn(data);
    }
  }
  function gotoHome() {
    guestLogin();
    navigation.navigate('Home');
  }
  function troubleLoggingIn() {
    navigation.navigate('Home', { screen: 'PasswordReset', params: { email } });
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        <Header style={{ display: 'none' }} />
        {!keyboardShowing && (
          <Text style={styles.brandText}>Bissoy Answers</Text>
        )}
        <View style={styles.secondary}>
          <View style={styles.login}>
            <Item
              onPress={() => emailInput?.focus?.()}
              error={emailError}
              style={styles.item}>
              <Icon type="AntDesign" name="mail" style={{ marginLeft: 10 }} />
              <TextInput
                ref={(r) => (emailInput = r)}
                style={{ flex: 1, fontSize: 16 }}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                // disabled={loggingIn}
                textContentType="emailAddress"
                autoCompleteType="email"
              />
              {emailError && (
                <Icon type="AntDesign" name="exclamationcircleo" />
              )}
            </Item>
            <Item
              onPress={() => passInput?.focus?.()}
              error={passwordError}
              style={styles.item}>
              <Icon type="AntDesign" name="key" style={{ marginLeft: 10 }} />
              <TextInput
                ref={(r) => (passInput = r)}
                style={{ flex: 1, fontSize: 16 }}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={hidePass ? true : false}
                textContentType="password"
                autoCorrect={false}
                // disabled={loggingIn}
              />
                 <FontIcon  name={hidePass ? 'eye-slash' : 'eye'}
              size={20}
              color="grey"
              onPress={() => setHidePass(!hidePass)}
            />

              {passwordError && (
                <Icon type="AntDesign" name="exclamationcircleo" />
              )}
            </Item>
            <TouchableNativeFeedback onPress={handleLogin}>
              <View
                style={{
                  ...styles.bigBtn,
                  elevation: 6,
                }}>
                {!loggingIn ? (
                  <Text style={styles.loginBtn}>Login</Text>
                ) : (
                  <ActivityIndicator size="large" color="#fff" />
                )}
              </View>
            </TouchableNativeFeedback>
            <TouchableOpacity onPress={troubleLoggingIn}>
              <Text style={styles.trouble}>Forgotten password?</Text>
            </TouchableOpacity>
          </View>
          {!keyboardShowing && (
            <>
              <TouchableNativeFeedback
                onPress={() => {
                  navigation.navigate('Register');
                }}>
                <View
                  style={{
                    ...styles.bigBtn,
                    maxWidth: 300,
                    elevation: 6,
                  }}>
                  <Text style={styles.craBtn}>Create an Account</Text>
                </View>
              </TouchableNativeFeedback>
              <View style={styles.footer}>
                <Text style={{ color: '#fff', fontSize: dynaSize(16) }}>
                  Or,{' '}
                </Text>
                <TouchableOpacity onPress={gotoHome}>
                  <Text style={styles.entGuest}>enter as a guest</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#16756d',
  },
  brandText: {
    width: '100%',
    color: '#fff',
    fontSize: dynaSize(26),
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: dynaSize(10),
  },
  secondary: {
    flex: 1,
    backgroundColor: '#fff1',
    marginHorizontal: 10,
    width: width - 20,
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  login: {
    width: width - 40,
    minHeight: height / 2.4,
    margin: 10,
    backgroundColor: '#fff',
    borderColor: '#fff1',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    borderRadius: 5,
    elevation: 6,
  },
  loginBtn: {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: dynaSize(20),
    color: '#fff',
  },
  craBtn: {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: dynaSize(20),
    color: '#fff',
  },
  item: {
    width: width - 60,
    maxWidth: 300,
    height: 45,
    margin: 10,
    backgroundColor: '#fefefe',
  },
  bigBtn: {
    width: width - 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: '#16756d',
    elevation: 2,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#ffffff',
  },
  trouble: {
    width: '100%',
    textAlign: 'center',
    color: '#16756d',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  entGuest: {
    width: '100%',
    textAlign: 'center',
    color: '#fff',
    fontSize: dynaSize(16),
    textDecorationLine: 'underline',
  },
  header: {
    marginVertical: 10,
  },
  footer: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 10,
  },
});
