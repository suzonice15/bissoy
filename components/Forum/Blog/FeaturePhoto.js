import React, { useState, useEffect } from 'react';
import {
  View,
  Alert,
  TouchableOpacity,
  Image as Img,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Button, Icon, Text, Toast } from 'native-base';

import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../../../contextHandler';
import { useContext } from 'react';
const devWidth = Dimensions.get('window').width;
export default function PhotoUpload({ navigation, route }) {
  const {
    state: { token },
  } = useContext(AuthContext);
  const [ftPhoto, setFtPhoto] = useState(null);
  const [ftPhotoUri, setFtPhotoUri] = useState(null);
  const [saving, setSaving] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     const {
  //       status,
  //     } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (status !== 'granted') {
  //       Alert.alert(
  //         'Sorry, we need camera roll permissions to make this work!'
  //       );
  //     }
  //   })();
  // }, []);

  async function selectPhoto() {
    let response = launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      includeBase64: true,
    });
    if (response.didCancel) {
      Toast.show({
        text: 'Cancelled image upload!',
        duration: 3000,
      });
      return;
    }
    const uri = response.uri;
    // console.log(uri);
    // const type = uri.substr(uri.lastIndexOf('.') + 1);
    // const name = Date.now() + type;
    setFtPhotoUri({ uri });
    setFtPhoto(response.base64);
  }
  async function saveBlog() {
    // console.log(ftPhoto);
    if (saving) return;
    setSaving(true);
    if (!ftPhoto) {
      Toast.show({
        text: 'Feature photo is required!',
        duration: 3000,
        type: 'danger',
      });
      return;
    }
    try {
      const { title, description, anonymous } = route.params;
      const fData = new FormData();
      fData.append('title', title);
      fData.append('description', description);
      fData.append('anonymous', anonymous.toString());
      fData.append('not_for_ans', '1');
      fData.append('feature_image', ftPhoto);

      const res = await fetch('https://www.bissoy.com/api/save_question', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: fData,
      });
      if (res.status === 200) {
        const data = await res.json();
        await navigation.navigate('QuestionDetails', {
          question_id: data.question_id,
        });
      } else {
        Toast.show({
          text: 'Failed to save the blog! ERR::C2XX',
          duration: 2000,
          type: 'warning',
        });
        setSaving(false);
      }
    } catch (e) {
      console.log(e);
      Toast.show({
        text: 'Failed to save the blog! ERR::S5XX',
        duration: 2000,
        type: 'danger',
      });
      setSaving(false);
    }
  }

  return (
    <View style={styles.flexOne}>
      <View style={styles.topContainer}>
        <Button
          style={styles.btn}
          onPress={() => navigation.navigate('BlogForm')}>
          <Icon
            style={styles.textWhite}
            name="chevron-left"
            type="FontAwesome5"
          />
        </Button>
        <Button style={styles.btn} onPress={() => saveBlog()}>
          {saving ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <Text style={styles.saveText}>save</Text>
          )}
        </Button>
      </View>
      <View style={styles.bottomContainer}>
        {ftPhotoUri !== null && (
          <>
            <Button
              small
              danger
              style={styles.btnRemove}
              onPress={() => setFtPhoto(null)}>
              <Text>remove</Text>
            </Button>
            <Img source={ftPhotoUri} style={styles.image} />
          </>
        )}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.selector}
          onPress={selectPhoto}>
          <Icon type="AntDesign" name="upload" style={styles.primaryIcon} />
          <Text style={styles.mainText}>
            {ftPhotoUri === null
              ? 'Upload a Feature Photo'
              : 'Choose another Photo'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#16756d',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWhite: {
    color: 'white',
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  primaryIcon: { fontSize: 36, color: '#16756d' },
  selector: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  btnRemove: { alignSelf: 'flex-start', marginStart: 30 },
  image: {
    flex: 1,
    marginVertical: 20,
    minWidth: devWidth - 100,
    minHeight: devWidth - 100,
    maxWidth: devWidth - 30,
    maxHeight: devWidth - 30,
  },
  mainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16756d',
    marginTop: 10,
  },
  btn: { elevation: 0, borderRadius: 0, width: 80, justifyContent: 'center' },
});
