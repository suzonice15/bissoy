import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Keyboard,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  Form,
  Item,
  Icon,
  Input,
  Header,
  Button,
  Spinner,
  Radio,
  Toast,
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../../contextHandler';
import { Switch } from 'react-native-gesture-handler';
import axios from '../../axios';
import { dynaSize } from '../../custom/helpers';
import { color } from 'react-native-reanimated';
import FontIcon from 'react-native-vector-icons/FontAwesome5';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const mailReg = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
let fst = true;

export default function Register({ navigation }) {
  const {
    authContext: { signIn },
  } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthday, setBirthDay] = useState(new Date(2000, 0, 1));
  const [gender, setGender] = useState(null);
  const [TOS, setTOS] = useState(false);

  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [TOSError, setTOSError] = useState(false);

  const [showDP, setShowDP] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const [hidePass, setHidePass] = useState(true);

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', () => {
      setKeyboardShowing(true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardShowing(false);
    });
    return () => {
      Keyboard.removeAllListeners('keyboardWillShow');
      Keyboard.removeAllListeners('keyboardDidHide');
      resetStates();
    };
  }, []);
  useEffect(() => {
    if (usernameError) setUsernameError(false);
    if (emailError) setEmailError(false);
    if (passwordError || confirmPasswordError) {
      setPasswordError(false);
      setConfirmPasswordError(false);
    }
    if (TOSError) setTOSError(false);
  }, [username, email, password, confirmPassword, TOS]);

  async function handleSignup() {
    if (keyboardShowing) Keyboard.dismiss();
    setLoggingIn(true);
    if (username.length < 4) {
      setUsernameError(true);
      Toast.show({
        text: 'Username not valid!',
        type: 'danger',
        buttonText: 'Retry',
        duration: 4000,
      });
      setLoggingIn(false);
      return;
    }
    if (email.length < 5 || !mailReg.test(email)) {
      setEmailError(true);
      Toast.show({
        text: 'Invalid email!',
        type: 'danger',
        buttonText: 'Retry',
        duration: 4000,
      });
      setLoggingIn(false);
      return;
    }
    if (password.length < 4) {
      setPasswordError(true);
      Toast.show({
        text: 'Password must be at least 6 charachters long!',
        type: 'danger',
        buttonText: 'Retry',
        duration: 4000,
      });
      setLoggingIn(false);
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      Toast.show({
        text: "Passwords didn't match!",
        type: 'danger',
        buttonText: 'Retry',
        duration: 4000,
      });
      setLoggingIn(false);
      return;
    }
    if (!TOS) {
      setTOSError(true);
      Toast.show({
        text: 'You must agree to accept the ToS!',
        type: 'danger',
        buttonText: 'Retry',
        duration: 4000,
      });
      setLoggingIn(false);
      return;
    }
    if (!gender || fst) {
      Toast.show({
        text: 'All fields are required!',
        type: 'danger',
        buttonText: 'Retry',
        duration: 4000,
      });
      setLoggingIn(false);
      return;
    }
    const birth_date = birthday.getDate();
    const birth_month = birthday.getMonth() + 1;
    const birth_year = birthday.getFullYear();

    if (
      !emailError &&
      !passwordError &&
      !confirmPasswordError &&
      !TOSError &&
      !!gender &&
      !fst
    ) {
      axios
        .post('register', {
          username,
          email,
          password,
          password_confirmation: confirmPassword,
          gender,
          birth_date,
          birth_month,
          birth_year,
        })
        .then((res) => {
          if (res.status === 200) {
            Toast.show({
              text: 'Registered! Signing you in.',
              type: 'success',
              duration: 2500,
            });
            const data = JSON.stringify({ email, password });
            Promise.resolve(signIn(data));
          }
        })
        .catch((err) => {
          if (err.response.status === 422) {
            Toast.show({
              text: err.response.data.errors,
              type: 'danger',
              buttonText: 'Retry',
              duration: 2500,
            });
          } else {
            console.log('register failed'); // err);
          }
        });
    } else {
      Toast.show({
        text: 'Unknown error occurred! ERR::S5XX',
        type: 'danger',
        buttonText: 'Retry',
        duration: 2500,
      });
    }
    setLoggingIn(false);
  }
  function resetStates() {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setTOS(false);
    setBirthDay(new Date(2000, 0, 1));
    setGender('');
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
    setTOSError(false);
    setLoggingIn(false);
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header style={{ display: 'none' }} />
      <View style={styles.main}>
        <View style={styles.signup}>
          <View style={styles.formContainer}>
            <ScrollView style={{ flex: 1 }}>
              <Text style={styles.brandText}>Sign Up for Bissoy</Text>
              <Form style={styles.form}>
                <View style={styles.item}>
                  <Item error={usernameError} style={styles.input}>
                    <Icon type="AntDesign" name="user" style={styles.ml10} />
                    <Input
                      placeholder="Username"
                      value={username}
                      onChangeText={setUsername}
                      disabled={loggingIn}
                      textContentType="username"
                      autoCompleteType="username"
                      style={styles.input}
                    />
                    {usernameError && (
                      <Icon type="AntDesign" name="exclamationcircleo" />
                    )}
                  </Item>
                </View>
                <View style={styles.item}>
                  <Item error={emailError} style={styles.input}>
                    <Icon type="AntDesign" name="mail" style={styles.ml10} />
                    <Input
                      placeholder="Email"
                      value={email}
                      onChangeText={setEmail}
                      disabled={loggingIn}
                      textContentType="emailAddress"
                      autoCompleteType="email"
                      style={styles.input}
                    />
                    {emailError && (
                      <Icon type="AntDesign" name="exclamationcircleo" />
                    )}
                  </Item>
                </View>

                <View style={styles.item}>
                  <Item error={passwordError} style={styles.input}>
                    <Icon type="AntDesign" name="key" style={styles.ml10} />
                    <Input
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={hidePass ? true : false}
                      textContentType="password"
                      autoCorrect={false}
                      disabled={loggingIn}
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
                </View>
                <View style={styles.item}>
                  <Item error={passwordError} style={styles.input}>
                    <Icon
                      type="AntDesign"
                      name="key"
                      style={{
                        marginLeft: 10,
                        transform: [{ rotate: '90deg' }],
                      }}
                    />
                    <Input
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                      textContentType="password"
                      autoCorrect={false}
                      disabled={loggingIn}
                    />
                    {confirmPasswordError && (
                      <Icon type="AntDesign" name="exclamationcircleo" />
                    )}
                  </Item>
                </View>
                <View style={styles.item}>
                  <Item style={styles.input}>
                    <Icon
                      type="AntDesign"
                      name="calendar"
                      style={styles.ml10}
                    />
                    <Button
                      transparent
                      onPress={() => setShowDP(true)}
                      style={{ flex: 1, marginLeft: 5 }}>
                      <Text style={{ fontSize: 18, color: '#555' }}>
                        {fst
                          ? 'Date of Birth'
                          : birthday.toLocaleString().substring(0, 11)}
                      </Text>
                    </Button>
                    {showDP && (
                      <DateTimePicker
                        value={birthday}
                        minimumDate={new Date(1970, 0, 1)}
                        maximumDate={new Date()}
                        mode="date"
                        display="default"
                        onChange={(_, d) => {
                          fst = false;
                          setShowDP(false);
                          setBirthDay(d || birthday);
                        }}
                        disabled={loggingIn}
                      />
                    )}
                  </Item>
                </View>
                <View style={styles.item}>
                  <Item style={styles.input}>
                    <Icon
                      type="FontAwesome"
                      name="intersex"
                      style={{
                        marginLeft: 12,
                        marginRight: 10,
                      }}
                    />
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                      }}>
                      <Radio
                        style={{ marginVertical: 10 }}
                        selectedColor="#16756d"
                        selected={gender === 'm'}
                        onPress={() => setGender('m')}
                      />
                      <Text style={styles.gender}>Male</Text>
                      <Radio
                        style={{ marginVertical: 10 }}
                        selectedColor="#16756d"
                        selected={gender === 'f'}
                        onPress={() => setGender('f')}
                      />
                      <Text style={styles.gender}>Female</Text>
                      <Radio
                        style={{ marginVertical: 10 }}
                        selectedColor="#16756d"
                        selected={gender === 'o'}
                        onPress={() => setGender('o')}
                      />
                      <Text style={styles.gender}>Other</Text>
                    </View>
                  </Item>
                </View>
                <View style={styles.tos}>
                  {TOSError && (
                    <Icon
                      type="AntDesign"
                      name="exclamationcircleo"
                      style={{ fontSize: 17, color: '#f00', marginRight: 5 }}
                    />
                  )}
                  <Switch
                    trackColor={{ false: '#767577', true: '#16886d' }}
                    thumbColor={TOS ? '#16756d' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={setTOS}
                    value={TOS}
                  />
                  <Text
                    style={{ fontSize: 17, color: TOSError ? '#f00' : '#444' }}>
                    {' '}
                    Accept our Terms of Services
                  </Text>
                </View>
                <Button style={styles.imgBtn} onPress={() => handleSignup()}>
                  {!loggingIn ? (
                    <Text style={styles.supBtn}>Sign Up</Text>
                  ) : (
                    <Spinner color="white" />
                  )}
                </Button>
              </Form>
              <Button
                transparent
                style={{ justifyContent: 'flex-end', alignItems: 'center' }}
                onPress={() =>
                  navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
                }
                iconLeft>
                <Icon type="AntDesign" name="arrowleft" />
                <Text style={styles.signIn}>Sign In</Text>
              </Button>
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const PAD = 4;
const styles = StyleSheet.create({
  ml10: { marginLeft: 10 },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16756d',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#16756d',
  },
  signup: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#fff1',
    borderWidth: 2,
    width: deviceWidth - 20,
    height: deviceHeight - 20,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    elevation: 6,
  },
  formContainer: {
    flex: 1,
    marginTop: 10,
  },
  form: {
    width: deviceWidth - 40,
    alignItems: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'flex-end',
    width: 75 * PAD,
    height: 14 * PAD,
    marginVertical: 5,
    backgroundColor: '#fefefe',
  },
  input: {
    width: '100%',
  },
  gender: {
    fontSize: 16,
    marginVertical: 10,
    marginRight: 15,
    color: '#555',
  },
  supBtn: {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: dynaSize(20),
    color: '#fff',
  },
  imgBtn: {
    width: '50%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginVertical: 5,
    borderRadius: 15,
    backgroundColor: '#16756d',
    elevation: 2,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ffffff',
  },
  brandText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: dynaSize(20),
    color: '#333',
    marginVertical: 10,
    color: '#16756d',
    minWidth: '70%',
    textAlign: 'center',
    paddingBottom: 10,
    borderBottomColor: '#16756d',
    borderBottomWidth: 1,
  },
  tos: {
    width: '100%',
    marginLeft: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  signIn: {
    color: '#16756d',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 10,
  },
});
