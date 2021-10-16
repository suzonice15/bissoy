import React, { useRef, useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Switch,
} from 'react-native';
import Modal from 'react-native-modal';
import axios from '../../../axios';
import {
  View,
  Button,
  Text,
  Input,
  InputGroup,
  Toast,
  H1,
  Spinner,
  Icon,
} from 'native-base';
import Editor from '../../../custom/TextEditor/Editor';
import Toolbar from '../../../custom/TextEditor/Toolbar';

import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import loc from '../../../localization/loc';

const deviceHeight = Dimensions.get('window').height;

let inpLink = '';
export default function AnswerForm({ question_id }) {
  let richText = useRef();
  const [expanded, setExpanded] = useState(false);
  const [anonymous, toggleAnonymous] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  useEffect(() => resetStates, []);

  function resetStates() {
    toggleAnonymous(false);
    richText?.setContentHTML?.('');
  }
  async function save() {
    if (loading) return;
    setLoading(true);
    const answer = (await richText.getContentHtml()) || '';
    if (answer.length < 4) {
      Toast.show({
        text: 'Body should be at least 4 characters!',
        duration: 2000,
        type: 'danger',
      });
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post(`q/${question_id}/answer`, {
        answer,
        anonymous: anonymous ? 1 : 0,
      });
      if (res.status === 200) {
        navigation.navigate('QuestionDetails', {
          question_id,
        });
      } else {
        Toast.show({
          text: res?.data?.msg || 'Something went wrong! ERR::S5XX',
          duration: 2000,
          type: 'danger',
        });
        navigation.navigate('QuestionDetails', {
          question_id,
        });
      }
    } catch (e) {
      setLoading(false);
      Toast.show({
        text: e?.response?.data?.msg || 'Something went wrong!',
        duration: 2000,
        type: 'danger',
      });
    }
    setLoading(false);
  }

  async function onPressAddImage() {
    richText.focusContentEditor();
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
      },
      function (response) {
        if (response.didCancel) {
          Toast.show({
            text: 'Cancelled image insertion!',
            duration: 2000,
          });
          return;
        }
        richText.insertImage(response.base64);
      }
    );
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

  if (!expanded) {
    return (
      <View style={styles.minimizedContainer}>
        <Button
          rounded
          bordered
          iconLeft
          style={styles.expandBtn}
          onPress={() => setExpanded(true)}>
          <Icon type="AntDesign" name="edit" />
          <Text style={{ fontWeight: 'bold' }}>{loc('write_ans')}</Text>
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <H1 style={styles.header}>Write your Answer</H1>
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
                minHeight: deviceHeight - 400,
              },
            ]}
            placeholder="Answer (must be at least 4 characters)"
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
      <View borderType="regular" style={styles.anonContainer}>
        <Switch value={anonymous} onValueChange={toggleAnonymous} />
        <Text style={{ marginLeft: 5 }}>Post anonymously</Text>
      </View>
      <View borderType="regular" style={styles.btnContainer}>
        <Button
          primary
          rounded
          style={styles.saveButton}
          onPress={save}
          disabled={loading}>
          {loading ? <Spinner color="#ffffff" /> : <Text>Answer</Text>}
        </Button>
      </View>
      <Modal isVisible={showLinkModal}>
        <InputGroup borderType="regular" style={styles.modalWrapper}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  minimizedContainer: {
    minHeight: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandBtn: {
    marginEnd: 10,
    justifyContent: 'center',
    backgroundColor: '#16756d11',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  header: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#777',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    backgroundColor: '#fff',
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
  saveButton: { marginEnd: 15, minWidth: 150, justifyContent: 'center' },
  urlInput: {
    width: '90%',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  anonContainer: {
    marginTop: 10,
    marginHorizontal: 5,
    flexDirection: 'row',
    width: '100%',
  },
  btnContainer: {
    marginTop: 10,
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  btns: {
    color: 'dodgerblue',
    fontWeight: 'bold',
  },
  unselected: { backgroundColor: 'darkgrey' },
  selected: {
    backgroundColor: 'mediumseagreen',
  },
  modalWrapper: {
    backgroundColor: '#fff',
    minHeight: 100,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
});
