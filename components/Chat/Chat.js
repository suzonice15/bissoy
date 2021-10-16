import React, { useState, useEffect } from 'react';
import { StyleSheet, PermissionsAndroid } from 'react-native';
import { WebView } from 'react-native-webview';
import { View, Text, Button, Icon } from 'native-base';

export default function Chat({ navigation }) {
  // const token = route?.params?.token || null;
  const [cameraPermission, setCameraPermission] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);
  useEffect(() => {
    askCameraPermissionAsync();
    askAudioPermissionAsync();
  }, []);
  useEffect(() => {
    if (!cameraPermission) askCameraPermissionAsync();
    if (!audioPermission) askAudioPermissionAsync();
  }, [cameraPermission, audioPermission]);
  async function askCameraPermissionAsync() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Allow Bissoy to use the Camera',
        message: `Bissoy needs access to your camera in order to engage in a video call`,
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    setCameraPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
  }
  async function askAudioPermissionAsync() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.AUDIO_RECORDING,
      {
        title: 'Allow Bissoy to use the Audio',
        message: `Bissoy needs to your microphone in order to engage in a the call`,
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    setAudioPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
  }
  function exit() {
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  }
  if (!cameraPermission) {
    return (
      <View style={styles.xyCentered}>
        <Text style={styles.wrnText}>Camera permission was not granted</Text>
        <Button onPress={askCameraPermissionAsync} rounded>
          <Text>Allow</Text>
        </Button>
      </View>
    );
  }
  if (!audioPermission) {
    return (
      <View style={styles.xyCentered}>
        <Text style={styles.wrnText}>Audio permission was not granted</Text>
        <Button onPress={askAudioPermissionAsync}>
          <Text>Allow</Text>
        </Button>
      </View>
    );
  }
  // if (!token) {
  //   return (
  //     <View style={styles.xyCentered}>
  //       <Text style={styles.wrnText}>Unknown call. No token found.</Text>
  //       <Button onPress={exit} iconLeft>
  //         <Icon style={styles.btnIco} type="Feather" name="power" />
  //         <Text>Exit</Text>
  //       </Button>
  //     </View>
  //   );
  // }
  return (
    <View style={styles.flexOne}>
      <View style={styles.headerContainer}>
        <Button style={styles.menuBtn} onPress={() => navigation.openDrawer()}>
          <Icon
            style={styles.btnIco}
            type="MaterialCommunityIcons"
            name="menu"
          />
        </Button>
        <Text style={styles.headerTitle}>Call</Text>
        <Button style={styles.menuBtn} onPress={exit} icon>
          <Icon style={styles.btnIco} type="Feather" name="power" />
        </Button>
      </View>
      <WebView
        style={styles.flexOne}
        useWebKit
        javaScriptEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
        source={{
          uri: 'https://call.bissoy.com',
        }}
        userAgent="Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Mobile Safari/537.36"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  xyCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrnText: {
    fontSize: 22,
    marginBottom: 50,
    color: '#f9f9f9',
    backgroundColor: '#f44',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#16756d',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuBtn: { elevation: 0, borderRadius: 0 },
  btnIco: { color: '#fafafa', marginHorizontal: 10 },
});
