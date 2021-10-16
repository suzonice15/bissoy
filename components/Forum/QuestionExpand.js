import React, {
  useState,
  memo,
  useContext,
  useRef,
  Fragment,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  InteractionManager,
} from 'react-native';
import axios from '../../axios';
import { Text, Button, Icon, H2, Toast } from 'native-base';
import { Facebook } from 'react-content-loader/native';
import AnswerListItem from './Answer/AnswerListItem';
import { AuthContext } from '../../contextHandler';
import QuestionComment from './Comment/QuestionComment';
import QuestionExpandDetails from './QuestionExpandDetails';
import RelatedQuestionList from './RelatedQuestionList';
import { useFocusEffect } from '@react-navigation/native';
import loc from '../../localization/loc';

const QuestionExpand = memo(({ route, navigation }) => {
  const {
    question_id,
    title,
    not_for_ans,
    user_id: q_uid,
    ans_count = 0,
    offered = 0,
  } = route.params;
  if (!question_id) return <Text>ERR::NO_ID_PASSED ({question_id})</Text>;
  const {
    state: { user },
  } = useContext(AuthContext);
  let aForm = useRef();
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [oneSelected, toggleOneSelected] = useState(false);
  const [showComments, toggleShowComments] = useState(false);
  const [didAnswered, toggleDidAnswered] = useState(true);
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
  function handleToastClose(reason) {
    if (reason === 'user') {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  }
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const fetchData = async () => {
        if (isMounted) setLoading(true);
        try {
          const res = await axios.get(`a/${question_id}`);
          if (res.status === 200) {
            if (isMounted) {
              toggleOneSelected(res.data.answers?.[0]?.selected == 1);
              setAnswers(res.data.answers);
              toggleDidAnswered(res.data.did_answered);
            }
          }
        } catch (e) {
          Toast.show({
            text: 'Failed to load answer! ERR::S5XX',
            duration: 2000,
            type: 'danger',
          });
        }
        if (isMounted) setLoading(false);
      };
      InteractionManager.runAfterInteractions(() => {
        askToLogin('Login to Answer!');
        fetchData();
        axios.get(`view_q/${question_id}`).catch();
      });
      return () => {
        isMounted = false;
        setLoading(true);
        setAnswers([]);
      };
    }, [question_id])
  );
  function selectAnswer(a_id) {
    toggleOneSelected(a_id != 0);
    setAnswers(
      answers.map((a) => ({ ...a, selected: a_id == a.answer_id ? 1 : 0 }))
    );
  }
  async function deleteConfirmed(a_id) {
    setAnswers(answers.filter((a) => a.answer_id != a_id));
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
  function gotoAnswer() {
    navigation.navigate('WriteAnswer', {
      question_id,
      title,
    });
  }
  async function close() {
    await navigation.navigate('QuestionList');
  }
  return (
    <View style={styles.flexOne}>
      <TouchableOpacity style={styles.close} onPress={close}>
        <Icon name="close" style={styles.closeColor} />
      </TouchableOpacity>
      <ScrollView
        style={styles.mainContainer}
        ref={(r) => {
          aForm = r;
        }}>
        <QuestionExpandDetails
          {...route.params}
          currentUser={user?.user_id}
          askToLogin={askToLogin}
          offered={offered}
        />
        <View style={styles.divider} />
        <TouchableOpacity
          onPress={() => toggleShowComments(!showComments)}
          style={styles.commentsBtn}>
          <Text note>{!showComments ? loc('show_c') : loc('hide_c')}</Text>
        </TouchableOpacity>
        {showComments && (
          <QuestionComment askToLogin={askToLogin} question_id={question_id} />
        )}
        {+not_for_ans !== 1 && (
          <>
            <H2 style={styles.h2}>{loc('ans_count', { count: +ans_count })}</H2>
            {!!user && (ans_count === 0 || !didAnswered) && (
              <View style={styles.minimizedContainer}>
                <Button
                  rounded
                  bordered
                  iconLeft
                  style={styles.expandBtn}
                  onPress={gotoAnswer}>
                  <Icon type="AntDesign" name="edit" />
                  <Text style={{ fontWeight: 'bold' }}>{loc('write_ans')}</Text>
                </Button>
              </View>
            )}
            {loading
              ? ans_count > 0 && (
                  <View style={styles.loaderContainer}>
                    {[...Array(ans_count || 4)].map((_, i) => (
                      <Fragment key={i}>
                        {i === 0 && (
                          <Text style={styles.loadingText}>Loading...</Text>
                        )}
                        <View style={styles.loaderDivider} />
                        <Facebook />
                      </Fragment>
                    ))}
                  </View>
                )
              : answers.map((answer) => (
                  <AnswerListItem
                    key={answer.answer_id}
                    answer={answer}
                    current_user={user?.user_id}
                    requestDelete={requestDelete}
                    askToLogin={askToLogin}
                    canSelect={
                      user?.user_id == q_uid || user?.user_role_id == 1
                    }
                    offered={offered}
                    oneSelected={oneSelected}
                    selectByID={selectAnswer}
                  />
                ))}
          </>
        )}
        <RelatedQuestionList question_id={question_id} />
      </ScrollView>
    </View>
  );
});

export default QuestionExpand;

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  close: { position: 'absolute', padding: 5, right: 0, zIndex: 6 },
  closeColor: { color: '#777' },
  loadingText: {
    textAlign: 'center',
    padding: 3,
    color: '#aaa',
    backgroundColor: '#fff',
  },
  h2: {
    textAlign: 'center',
    paddingTop: 7,
    paddingBottom: 4,
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 6,
    backgroundColor: '#fff',
  },
  mainContainer: {
    backgroundColor: '#fff',
  },
  commentsBtn: {
    backgroundColor: '#fafafa',
    padding: 10,
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 6,
  },
  divider: { backgroundColor: '#efefef', height: 1 },
  loaderContainer: { flex: 1, margin: 10 },
  loaderDivider: {
    backgroundColor: '#efefef',
    height: 1,
    marginBottom: 25,
  },
  footerContainer: {
    flexDirection: 'row',
    margin: 7,
  },
  modalContainer: { backgroundColor: '#fff', padding: 10, borderRadius: 5 },
  modalBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
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
