import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Keyboard,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  TouchableNativeFeedback,
  TextInput,
} from 'react-native';
import { Item, Icon, Header, Toast } from 'native-base';
import { AuthContext } from '../../contextHandler';
import { dynaSize } from '../../custom/helpers';
import axios from '../../axios';
import FontIcon from 'react-native-vector-icons/FontAwesome5';


const { width, height } = Dimensions.get('window');

const mailReg = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function PasswordReset({ navigation, route }) {
  const _email = route?.params?.email || '';
  const {
    state: { isSigningIn },
    authContext: { signIn },
  } = useContext(AuthContext);
  const [email, setEmail] = useState(_email);
  const [emailError, setEmailError] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [codeVerified, setCodeVerified] = useState(false);
  const [codeError, setCodeError] = useState(false);
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
      setPassword('');
      setEmailError(false);
      setCodeError(false);
      setPasswordError(false);
      setLoggingIn(false);
    };
  }, []);
  useEffect(() => {
    if (emailError) setEmailError(false);
    if (codeError) setCodeError(false);
    if (passwordError) setPasswordError(false);
    if (!email) {
      setCode('');
      setCodeSent(false);
      setCodeVerified(false);
      setPassword('');
    } else if (!code) {
      setCodeSent(false);
      setCodeVerified(false);
      setPassword('');
    }
  }, [email, code, password]);

  useEffect(() => {
    setLoggingIn(isSigningIn);
  }, [isSigningIn]);

  async function checkEmail() {
    setLoggingIn(true);
    if (email.length < 5 || !mailReg.test(email)) {
      setEmailError(true);
      setLoggingIn(false);
      return;
    }
    try {
      const res = await axios.post('request/reset', { email });
      if (res.status === 200) {
        setCodeSent(true);
        setLoggingIn(false);
      } else {
        setCodeSent(false);
        setEmailError(true);
        setLoggingIn(false);
        Toast.show({
          text: res.data || 'Wrong email!',
          type: 'danger',
          duration: 2000,
        });
      }
    } catch (e) {
      setCodeSent(false);
      setEmailError(true);
      setLoggingIn(false);
      Toast.show({
        text: 'Wrong email!',
        type: 'danger',
        duration: 2000,
      });
    }
  }
  async function checkCode() {
    setLoggingIn(true);
    if (code.length !== 6) {
      setCodeError(true);
      setLoggingIn(false);
      Toast.show({
        text: 'Must be a 6-digit code!',
        type: 'danger',
        duration: 2000,
      });
      return;
    }
    try {
      const res = await axios.post('request/verify', { email, code });
      if (res.status === 200) {
        setCodeVerified(true);
        setLoggingIn(false);
      } else {
        setCodeVerified(false);
        setCodeError(true);
        setLoggingIn(false);
        Toast.show({
          text: res.data || 'Wrong code!',
          type: 'danger',
          duration: 2000,
        });
      }
    } catch (e) {
      setCodeVerified(false);
      setCodeError(true);
      setLoggingIn(false);
      Toast.show({
        text: 'Wrong code! ERR::S5XX',
        type: 'danger',
        duration: 2000,
      });
    }
  }
  async function resetPassword() {
    setLoggingIn(true);
    if (password.length < 4) {
      setPasswordError(true);
      setLoggingIn(false);
      return;
    }
    try {
      const res = await axios.post('request/change', { email, code, password });
      if (res.status === 200) {
        setLoggingIn(false);
        Toast.show({
          text: 'Password reset successfully!',
          type: 'success',
          duration: 2000,
        });
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      } else {
        setPasswordError(true);
        setLoggingIn(false);
        Toast.show({
          text: res.data || 'Something went wrong! ERR::C2XX',
          type: 'danger',
          duration: 2000,
        });
      }
    } catch (e) {
      setPasswordError(true);
      setLoggingIn(false);
      Toast.show({
        text: 'Something went wrong! ERR::S5XX',
        type: 'danger',
        duration: 2000,
      });
    }
  }

  async function handleSubmit() {
    Keyboard.dismiss();
    setLoggingIn(false);
    if (!codeSent) {
      checkEmail();
    } else if (!codeVerified) {
      checkCode();
    } else {
      resetPassword();
    }
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
            {!codeSent ? (
              <Item error={emailError} style={styles.item}>
                <Icon type="AntDesign" name="mail" style={{ marginLeft: 10 }} />
                <TextInput
                  style={{ flex: 1, fontSize: 16 }}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  textContentType="emailAddress"
                  autoCompleteType="email"
                />
                {emailError && (
                  <Icon type="AntDesign" name="exclamationcircleo" />
                )}
              </Item>
            ) : !codeVerified ? (
              <Item error={codeError} style={styles.item}>
                <Icon type="Feather" name="shield" style={{ marginLeft: 10 }} />
                <TextInput
                  style={{ flex: 1, fontSize: 16 }}
                  placeholder="6-digit code"
                  value={code}
                  onChangeText={setCode}
                  textContentType="oneTimeCode"
                  autoCompleteType="off"
                  maxLength={6}
                />
                {codeError && (
                  <Icon type="AntDesign" name="exclamationcircleo" />
                )}
              </Item>
            ) : (
              <Item error={passwordError} style={styles.item}>
                <Icon type="AntDesign" name="key" style={{ marginLeft: 10 }} />
                <TextInput
                  style={{ flex: 1, fontSize: 16 }}
                  placeholder="New Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={hidePass ? true : false}
                  textContentType="password"
                  autoCorrect={false}
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
            )}
            <TouchableNativeFeedback onPress={handleSubmit}>
              <View
                style={{
                  ...styles.bigBtn,
                  elevation: 6,
                }}>
                {!loggingIn ? (
                  <Text style={styles.loginBtn}>
                    {!codeSent
                      ? 'Send Reset Code'
                      : !codeVerified
                      ? 'Verify'
                      : 'Reset Password'}
                  </Text>
                ) : (
                  <ActivityIndicator size="large" color="#fff" />
                )}
              </View>
            </TouchableNativeFeedback>
          </View>
          {!keyboardShowing && (
            <>
              <TouchableNativeFeedback
                onPress={() =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                }>
                <View
                  style={{
                    ...styles.bigBtn,
                    maxWidth: 300,
                    elevation: 6,
                  }}>
                  <Text style={styles.craBtn}>Sign In</Text>
                </View>
              </TouchableNativeFeedback>
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
    fontSize: 18,
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
