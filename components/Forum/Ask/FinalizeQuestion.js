import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import {
  View,
  Button,
  Text,
  Input,
  InputGroup,
  Toast,
  Icon,
} from 'native-base';
import Modal from 'react-native-modal';
import Editor from '../../../custom/TextEditor/Editor';
import Toolbar from '../../../custom/TextEditor/Toolbar';
import axios from '../../../axios';

import { launchImageLibrary } from 'react-native-image-picker';
import loc from '../../../localization/loc';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { AuthContext } from '../../../contextHandler';

const deviceHeight = Dimensions.get('window').height;

let inpLink = '';
export default function FinalizeQuestion({ navigation, route }) {
  let richText = useRef();
  const [title, setTitle] = useState(route.params.cTitle || '');
  const [anonymous, toggleAnonymous] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uri, setUri] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    state: { token },
  } = useContext(AuthContext);

  useEffect(() => {
    checkQMark();
    return () => {
      resetStates();
    };
  }, []);

  function resetStates() {
    toggleAnonymous(false);
    setSaving(false);
    richText?.setContentHTML?.('');
  }
  function checkQMark() {
    let ct = title.trim();
    if (ct.length > 0 && ct[ct.length - 1] !== '?') {
      ct += '?';
      setTitle(ct);
    }
  }

  async function save() {
    try {
      checkQMark();
      if (title.length < 5) {
        Toast.show({
          text: 'Title should be at least 5 characters!',
          duration: 2000,
          type: 'danger',
        });
        return;
      }
      const description = (await richText.getContentHtml()) || '';
      setSaving(true);
      const res = await axios.post('save_question', {
        title,
        description,
        anonymous: anonymous ? 1 : 0,
      });
      if (res.status === 200) {
        await navigation.navigate('QuestionDetails', {
          question_id: res.data.question_id,
          justAdded: true,
        });
      }
    } catch (e) {
      setSaving(false);
      console.log(e);
      throw e;
    }
  }
  useEffect(() => {
    if (uri.length < 10) return;
    richText.focusContentEditor();
    richText.insertImage(uri);
  }, [uri]);
  async function onPressAddImage() {
    try {
      setUri('');
      launchImageLibrary(
        {
          mediaType: 'photo',
          quality: 1,
          includeBase64: true,
        },
        async function (response) {
          if (response.didCancel) {
            Toast.show({
              text: 'Cancelled image insertion!',
              duration: 2000,
            });
            return;
          }
          setUploading(true);
          const fd = new FormData();
          fd.append('image', response.base64);
          const res = await fetch('https://www.bissoy.com/api/forum/image', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            },
            body: fd,
          });
          if (res.status === 200) {
            setUploading(false);
            const data = await res.text();
            setUri(data);
          } else {
            setUploading(false);
            setUri('');
            Toast.show({
              text: 'File size must be less than 2MiB',
              duration: 2000,
              type: 'warning',
            });
          }
        }
      );
    } catch (e) {
      console.log(e);
      Toast.show({
        text: 'Failed to insert the image. ERR::S5XX',
        duration: 2000,
        type: 'warning',
      });
      setUploading(false);
    }
  }
  function onPressAddLink() {
    richText.focusContentEditor();
    setShowLinkModal(true);
  }
  function handleInsertLink() {
    if (inpLink) richText.insertLink(inpLink);
    else {
      Toast.show({
        text: 'No valid URL given!',
        duration: 2000,
        style: { opacity: 1 },
      });
    }
    setShowLinkModal(false);
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Button
          style={{ elevation: 0, borderRadius: 0 }}
          onPress={navigation.goBack}>
          <Icon type="MaterialIcons" name="arrow-back" />
        </Button>
        <Button style={styles.btn} onPress={save}>
          {saving ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <Text style={styles.saveText}>{loc('ask')}</Text>
          )}
        </Button>
      </View>
      <KeyboardAvoidingView
        behavior="height"
        keyboardVerticalOffset={25}
        style={{ flex: 1 }}>
        <View style={styles.container}>
          {uploading && (
            <View style={styles.uploader}>
              <ActivityIndicator size="large" color="#16756d" />
              <Text style={{ color: '#16756d', marginTop: 10 }}>
                Uploading...
              </Text>
            </View>
          )}
          <InputGroup borderType="regular" style={styles.title}>
            <TextInput
              multiline
              placeholder={loc('ask_title')}
              placeholderTextColor="darkgrey"
              value={title}
              onChangeText={setTitle}
            />
          </InputGroup>
          <TouchableWithoutFeedback
            borderType="regular"
            onPress={() => toggleAnonymous(!anonymous)}
            style={styles.anonContainer}>
            <Switch value={anonymous} />
            <Text style={styles.anonPh}>{loc('ask_anon')}</Text>
          </TouchableWithoutFeedback>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              richText.focusContentEditor();
            }}
            style={{ flex: 1 }}>
            <ScrollView style={styles.scroll}>
              <Editor
                ref={(r) => (richText = r)}
                style={[
                  styles.rich,
                  {
                    minHeight: deviceHeight - 300,
                  },
                ]}
                placeholder={loc('desc_ph')}
              />
            </ScrollView>
          </TouchableOpacity>
          <Toolbar
            style={styles.richBar}
            getEditor={() => richText}
            iconTint={'#000033'}
            selectedIconTint={'#2095F2'}
            selectedButtonStyle={{ backgroundColor: 'transparent' }}
            onPressAddImage={onPressAddImage}
            onPressAddLink={onPressAddLink}
          />
        </View>
      </KeyboardAvoidingView>
      <Modal isVisible={showLinkModal}>
        <InputGroup borderType="regular" style={styles.linkInputContainer}>
          <Input
            placeholder="URL"
            placeholderTextColor="#ccc"
            style={styles.urlInput}
            onChangeText={(link) => (inpLink = link)}
          />
          <Button
            transparent
            style={{ alignSelf: 'flex-end', margin: 5 }}
            onPress={handleInsertLink}>
            <Text>Insert</Text>
          </Button>
        </InputGroup>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#16756d',
  },
  title: { backgroundColor: '#fff', height: 50 },
  rich: {
    flex: 1,
    borderColor: '#f67',
    borderWidth: 2,
  },
  richBar: {
    height: 50,
    backgroundColor: '#fafafa',
  },
  scroll: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },
  btn: { elevation: 0, borderRadius: 0, justifyContent: 'center' },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  anonContainer: {
    marginTop: 15,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 5,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    borderBottomWidth: 0.5,
  },
  anonPh: { marginLeft: 5, color: '#777' },
  linkInputContainer: {
    backgroundColor: '#fff',
    minHeight: 100,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  urlInput: {
    width: '90%',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  uploader: {
    flex: 1,
    position: 'absolute',
    zIndex: 100,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
