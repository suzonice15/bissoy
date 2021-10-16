import React, {
  useRef,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Switch,
  InteractionManager,
  ActivityIndicator,
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
import Editor from '../../custom/TextEditor/Editor';
import Toolbar from '../../custom/TextEditor/Toolbar';
import axios from '../../axios';
import { launchImageLibrary } from 'react-native-image-picker';
import loc from '../../localization/loc';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../contextHandler';

const deviceHeight = Dimensions.get('window').height;

let inpLink = '';
export default function QuestionEdit({ navigation, route }) {
  const question_id = route?.params?.question_id || null;
  let isMounted = true;
  if (!question_id) return <Text>ERR::QUESTION_NOT_FOUND</Text>;
  let richText = useRef();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [anonymous, toggleAnonymous] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uri, setUri] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    state: { token },
  } = useContext(AuthContext);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await axios.get(`q/${question_id}/edit`);
      if (isMounted && res.status === 200) {
        const question = res.data;
        setTitle(question.title);
        setDescription(question.description || '');
        toggleAnonymous(+question.anonymous);
      }
      setLoading(false);
    } catch (e) {
      throw e;
    }
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
    }, [])
  );

  function resetStates() {
    setTitle('');
    toggleAnonymous(false);
    setSaving(false);
    setUri('');
    setUploading(false);
    richText?.setContentHTML?.('');
  }
  async function edit() {
    try {
      if (title.length < 5) {
        Toast.show({
          text: 'Title should be at least 5 characters!',
          duration: 2000,
          type: 'danger',
        });
        return;
      }
      const newDescription = (await richText.getContentHtml()) || '';
      setSaving(true);
      const res = await axios.post(`q/${question_id}/edit`, {
        title,
        description: newDescription,
        anonymous: anonymous ? 1 : 0,
      });
      if (res.status === 200) {
        Toast.show({
          text: 'Question edited successfully!',
          duration: 2000,
          type: 'success',
        });
        await navigation.navigate('QuestionDetails', {
          question_id: question_id,
          justAdded: false,
        });
      }
      setSaving(false);
    } catch (e) {
      Toast.show({
        text: 'Something went wrong! ERR::S5XX',
        duration: 2000,
        type: 'danger',
      });
      setSaving(false);
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
      {loading ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#555', fontSize: 20 }}>Loading...</Text>
        </View>
      ) : (
        <>
          <View style={styles.headerContainer}>
            <Button
              style={{ elevation: 0, borderRadius: 0 }}
              onPress={() => navigation.goBack()}>
              <Icon type="MaterialIcons" name="arrow-back" />
            </Button>
            <Button style={styles.btn} onPress={edit}>
              {saving ? (
                <ActivityIndicator color="#fff" size="large" />
              ) : (
                <Text style={styles.saveText}>Edit</Text>
              )}
            </Button>
          </View>

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
              <Input
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
                  initialContentHTML={description || ''}
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
