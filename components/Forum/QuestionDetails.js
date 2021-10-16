import React, { useState, useCallback, memo, useContext } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  InteractionManager,
  Alert,
  RefreshControl,
} from 'react-native';
import axios from '../../axios';
import { View, Text, Icon, H2, Toast, Button } from 'native-base';
import QuestionDetailView from './QuestionDetailView';
import AnswerListItem from './Answer/AnswerListItem';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../contextHandler';
import ListLoaders from './loaders/ListLoaders';
import QuestionComment from './Comment/QuestionComment';
import RelatedQuestionList from './RelatedQuestionList';
import Modal from 'react-native-modal';
import loc from '../../localization/loc';

const QuestionDetails = memo(({ route, navigation }) => {
  let { question_id, justAdded = false } = route.params;
  if (!question_id) return <Text>ERR::NO_ID_PASSED ({question_id})</Text>;
  const {
    state: { user },
  } = useContext(AuthContext);
  const [isJustAdded, setIsJustAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState({});
  const [tags, setTags] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [didAnswered, toggleDidAnswered] = useState(true);
  const [oneSelected, toggleOneSelected] = useState(false);
  const [showComments, toggleShowComments] = useState(false);
  let mounted = true;
  function askToLogin(text = 'Login Required!') {
    if (!user) {
      Toast.show({
        text,
        buttonText: 'Login',
        type: 'warning',
        duration: 3000,
        onClose: handleToastClose,
      });
      return true;
    }
    return false;
  }
  useFocusEffect(
    useCallback(() => {
      setIsJustAdded(justAdded);
      const task = InteractionManager.runAfterInteractions(() => {
        askToLogin('Login to Answer!');
        fetchData();
        axios.get(`view_q/${question_id}`).catch();
      });
      return () => {
        justAdded = false;
        setIsJustAdded(false);
        mounted = false;
        task.cancel();
      };
    }, [question_id])
  );
  const fetchData = async () => {
    if (mounted) {
      setLoading(true);
    }
    try {
      const res = await axios.get(`q/${question_id}`);
      if (mounted && res.status === 200) {
        setQuestion(res.data.question);
        setTags(res.data.tags);
        toggleDidAnswered(res.data.did_answered);
        toggleOneSelected(res.data.answers?.[0]?.selected == 1);
        setAnswers(res.data.answers);
      }
    } catch (e) {
      Toast.show({
        text: 'Failed to load the Question! ERR::S5XX',
        duration: 2000,
        type: 'danger',
      });
    }
    if (mounted) {
      setLoading(false);
    }
  };
  function handleToastClose(reason) {
    if (reason === 'user') {
      navigation.navigate('Login');
    }
  }
  function selectAnswer(a_id) {
    toggleOneSelected(a_id !== 0);
    setAnswers(
      answers.map((a) => ({ ...a, selected: a_id == a.answer_id ? 1 : 0 }))
    );
  }
  async function deleteConfirmed(a_id) {
    setAnswers(answers.filter((a) => a.answer_id == a_id));
    try {
      const res = await axios.post(`a/${a_id}/delete`);
      if (res.status === 200) {
        Toast.show({
          text: 'Answer deleted!',
          duration: 2000,
          type: 'success',
        });
      }
    } catch (e) {
      throw e;
    }
  }
  function requestDelete(a_id) {
    Alert.alert(
      'Are you sure?',
      "This can't be undone.",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteConfirmed(a_id),
        },
      ],
      { cancelable: false }
    );
  }
  async function close() {
    await navigation.navigate('Home', { screen: 'QuestionList' });
  }
  function closeJustAdded() {
    setIsJustAdded(false);
  }
  function gotoAnswer() {
    navigation.navigate('WriteAnswer', {
      question_id,
      title: question.title,
    });
  }
  function gotoSelectTopic() {
    navigation.navigate('SelectTopic', {
      question_id,
      title: question.title,
      tags,
    });
  }
  function openOfferModal() {
    if (askToLogin?.()) return;
    navigation.navigate('RewardModal', {
      gifted_for: 'offer',
      gifted_to: question.user_id,
      entity_id: question.question_id,
      question_id,
      toUsername: question.username,
    });
  }
  return (
    <View style={styles.flexOne}>
      <TouchableOpacity style={styles.close} onPress={close}>
        <Icon name="close" style={styles.greyText} />
      </TouchableOpacity>
      <ScrollView
        style={styles.mainContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
        }>
        {loading ? (
          <ListLoaders />
        ) : (
          <>
            <QuestionDetailView
              question={question}
              tags={tags}
              user_id={user?.user_id}
              askToLogin={askToLogin}
            />
            <View style={styles.divider} />
            <TouchableOpacity
              onPress={() => toggleShowComments(!showComments)}
              style={styles.commentsBtn}>
              <Text note>{!showComments ? loc('show_c') : loc('hide_c')}</Text>
            </TouchableOpacity>
            {showComments && (
              <QuestionComment
                askToLogin={askToLogin}
                question_id={question_id}
              />
            )}
            {+question.not_for_ans === 0 && (
              <>
                <H2 style={styles.h2}>
                  {loc('ans_count', { count: +question.ans_count })}
                </H2>
                {!!user &&
                  +question.not_for_ans === 0 &&
                  (+question.ans_count === 0 || !didAnswered) && (
                    <View style={styles.minimizedContainer}>
                      <Button
                        rounded
                        bordered
                        iconLeft
                        style={styles.expandBtn}
                        onPress={gotoAnswer}>
                        <Icon type="AntDesign" name="edit" />
                        <Text style={{ fontWeight: 'bold' }}>
                          {loc('write_ans')}
                        </Text>
                      </Button>
                    </View>
                  )}
                {answers.map((answer) => (
                  <AnswerListItem
                    key={answer.answer_id}
                    answer={answer}
                    current_user={user?.user_id}
                    requestDelete={requestDelete}
                    askToLogin={askToLogin}
                    canSelect={user?.user_id == question.user_id}
                    offered={question.offered}
                    oneSelected={oneSelected}
                    selectByID={selectAnswer}
                  />
                ))}
              </>
            )}
          </>
        )}
        <RelatedQuestionList question_id={question_id} />
      </ScrollView>
      <Modal isVisible={isJustAdded}>
        <View style={styles.modalContainer}>
          {question.not_for_ans != 1 && (
            <Text style={styles.modalTitle}>{loc('jam_title')}&mdash;</Text>
          )}
          <Button
            large
            dark
            style={styles.modalMainBtn}
            onPress={gotoSelectTopic}>
            <Text style={styles.modalBtnText}>{loc('jam_topic')}</Text>
          </Button>
          {question.not_for_ans != 1 && (
            <Button onPress={openOfferModal} large style={styles.modalMainBtn}>
              <Text style={styles.modalBtnText}>{loc('jam_offer')}</Text>
            </Button>
          )}
          <Button
            transparent
            style={{
              justifyContent: 'center',
            }}
            onPress={closeJustAdded}>
            <Text style={styles.modalCloseText}>{loc('close')}</Text>
          </Button>
        </View>
      </Modal>
    </View>
  );
});
export default QuestionDetails;

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  greyText: { color: '#777' },
  close: { position: 'absolute', padding: 7, right: 5, zIndex: 6 },
  loadingText: {
    textAlign: 'center',
    padding: 3,
    color: '#aaa',
    backgroundColor: '#fff',
  },
  h2: {
    textAlign: 'center',
    padding: 3,
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 6,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  commentsBtn: {
    backgroundColor: '#fafafa',
    padding: 10,
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 6,
  },
  divider: { backgroundColor: '#efefef', height: 1 },
  footerContainer: {
    flexDirection: 'row',
    margin: 7,
  },
  modalContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 20,
  },
  modalMainBtn: {
    width: '100%',
    margin: 10,
    borderRadius: 50,
    justifyContent: 'center',
  },
  modalBtnText: { fontSize: 22, color: '#fff', fontWeight: 'bold' },
  modalCloseText: {
    fontSize: 22,
    color: '#555',
    fontWeight: 'bold',
  },
  minimizedContainer: {
    minHeight: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 6,
  },
  expandBtn: {
    marginEnd: 10,
    justifyContent: 'center',
    backgroundColor: '#16756d11',
  },
});
