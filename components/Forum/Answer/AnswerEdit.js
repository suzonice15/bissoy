import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  Switch,
  InteractionManager,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import Modal from 'react-native-modal';

import {
  View,
  Button,
  Text,
  Input,
  InputGroup,
  Toast,
  Header,
  Icon,
} from 'native-base';
import axios from '../../../axios';
import Editor from '../../../custom/TextEditor/Editor';
import Toolbar from '../../../custom/TextEditor/Toolbar';

import { launchImageLibrary } from 'react-native-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../../contextHandler';
const deviceHeight = Dimensions.get('window').height;

let isMounted = false;
let inpLink = '';
export default function AnswerEdit({ navigation, route }) {
  const { answer_id, question_id } = route.params;
  if (!answer_id) return <Text>ERR::QUESTION_NOT_FOUND</Text>;
  let richText = useRef();
  const [answer, setAnswer] = useState('');
  const [anonymous, toggleAnonymous] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uri, setUri] = useState('');
  const [uploading, setUploading] = useState(false);

  const {
    state: { token },
  } = useContext(AuthContext);

  useEffect(() => {
    return () => {
      resetStates();
    };
  }, []);
  async function fetchData() {
    setLoading(true);
    try {
      const res = await axios.get(`a/${answer_id}/edit`);
      if (isMounted && res.status === 200) {
        setAnswer(res.data?.[0]?.answer || '');
        toggleAnonymous(res.data?.[0]?.anonymous || false);
      }
    } catch (e) {
      Toast.show({
        text: 'Could not load the answer! ERR::S5XX',
        duration: 2000,
        type: 'danger',
      });
    }
    setLoading(false);
  }
  useFocusEffect(
    useCallback(() => {
      isMounted = true;
      const task = InteractionManager.runAfterInteractions(() => {
        fetchData();
      });
      return () => {
        task.cancel();
        resetStates();
        isMounted = false;
      };
    }, [answer_id])
  );
  function resetStates() {
    setAnswer('');
    toggleAnonymous(false);
    setUri('');
    setUploading(false);
    richText?.setContentHTML?.('');
  }
  async function edit() {
    try {
      const new_answer = (await richText.getContentHtml()) || '';
      if (new_answer.length < 4) {
        Toast.show({
          text: 'Answer should be at least 4 characters!',
          duration: 2000,
          type: 'danger',
        });
        return;
      }
      setEditing(true);
      const res = await axios.post(`a/${answer_id}/edit`, {
        answer: new_answer,
        anonymous: anonymous ? 1 : 0,
      });
      if (res.status === 200) {
        resetStates();
        Toast.show({
          text: 'Answer edited successfully!',
          duration: 2000,
          type: 'success',
        });
        navigation.pop();
        navigation.navigate('QuestionDetails', { question_id });
      }
    } catch (e) {
      Toast.show({
        text: 'Answer Edit Failed! ERR::S5XX',
        duration: 2000,
        type: 'danger',
      });
    }
    setEditing(false);
  }
  useEffect(() => {
    if (uri.length < 10) return;
    richText.focusContentEditor();
    richText.insertImage(uri);
  }, [uri]);
  async function onPressAddImage() {
    try {
      setUri('');
      let response = launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
      });
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
  function cancel() {
    Keyboard.dismiss();
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header style={{ display: 'none' }} />
      {loading ? (
        <View style={styles.absCenter}>
          <Text style={{ color: '#555', fontSize: 20 }}>Loading...</Text>
        </View>
      ) : (
        <>
          <View style={styles.headerContainer}>
            <Button style={{ elevation: 0, borderRadius: 0 }} onPress={cancel}>
              <Icon name="arrow-back" />
            </Button>
            <Text
              style={[styles.btnText, { flexGrow: 1, textAlign: 'center' }]}>
              Edit Answer
            </Text>
          </View>
          {uploading && (
            <View style={styles.uploader}>
              <ActivityIndicator size="large" color="#16756d" />
              <Text style={{ color: '#16756d', marginTop: 10 }}>
                Uploading...
              </Text>
            </View>
          )}
          <KeyboardAvoidingView
            behavior="height"
            keyboardVerticalOffset={25}
            style={{ flex: 1 }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                richText.focusContentEditor();
              }}
              style={{ flex: 1 }}>
              <ScrollView style={styles.scroll}>
                <Editor
                  ref={(r) => (richText = r)}
                  initialContentHTML={answer || ''}
                  style={[
                    styles.rich,
                    {
                      minHeight: deviceHeight - 300,
                    },
                  ]}
                  placeholder="Write your answer."
                />
              </ScrollView>
            </TouchableOpacity>
            <Toolbar
              style={styles.richBar}
              getEditor={() => richText}
              iconTint={'#000033'}
              selectedIconTint={'#2095F2'}
              selectedButtonStyle={{
                backgroundColor: 'transparent',
              }}
              onPressAddImage={onPressAddImage}
              onPressAddLink={onPressAddLink}
            />
          </KeyboardAvoidingView>
          <View borderType="regular" style={styles.anonContainer}>
            <Switch value={anonymous} onValueChange={toggleAnonymous} />
            <Text style={{ marginLeft: 5 }}>Make anonymous</Text>
          </View>
          <View style={styles.editBtnContainer}>
            <Button style={styles.editBtn} onPress={edit} disabled={editing}>
              {editing ? (
                <ActivityIndicator color="#fff" size="large" />
              ) : (
                <Text style={styles.btnText} uppercase={false}>
                  Edit Answer
                </Text>
              )}
            </Button>
            <Button style={{ marginHorizontal: 5 }} light onPress={cancel}>
              <Text style={styles.btnText} uppercase={false}>
                Cancel
              </Text>
            </Button>
          </View>
          <Modal isVisible={showLinkModal}>
            <InputGroup borderType="regular" style={styles.modalInput}>
              <Input
                placeholder="URL"
                placeholderTextColor="#ccc"
                style={{
                  width: '90%',
                  borderBottomColor: '#ddd',
                  borderBottomWidth: 1,
                }}
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
        </>
      )}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#16756d',
  },
  absCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  anonContainer: {
    marginVertical: 15,
    marginHorizontal: 5,
    flexDirection: 'row',
    width: '100%',
  },
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
  editBtnContainer: {
    marginHorizontal: 5,
    marginBottom: 5,
    flexDirection: 'row',
  },
  editBtn: {
    marginHorizontal: 5,
    minWidth: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btns: {
    color: 'dodgerblue',
    fontWeight: 'bold',
  },
  modalInput: {
    backgroundColor: '#fff',
    minHeight: 100,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  unselected: { backgroundColor: 'darkgrey' },
  selected: {
    backgroundColor: 'mediumseagreen',
  },
  btnText: { color: '#f9f9f9', fontSize: 18, fontWeight: 'bold' },
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
