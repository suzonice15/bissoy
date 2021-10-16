import React, { useState, useCallback, memo } from 'react';
import { ListItem, Text, View } from 'native-base';
import axios from '../../axios';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import loc from '../../localization/loc';
const QItem = memo(
  ({
    question_id,
    title,
    description,
    ans_count,
    question_view_count,
    goToQuestion,
  }) => {
    const desc = description
      ?.replace(/&nbsp;|\/r|\/n|<\/?[^>]+(>|$)/g, '')
      ?.trim();
    return (
      <ListItem
        onPress={() => goToQuestion(question_id)}
        key={question_id}
        noIndent
        style={{ flexDirection: 'column' }}>
        <View style={styles.body}>
          <Text>{title}</Text>
          {desc?.length > 0 && (
            <Text note numberOfLines={1}>
              {desc}
            </Text>
          )}
        </View>
        <View style={styles.footer}>
          <Text note>
            {ans_count} {ans_count > 1 ? 'answers' : 'answer'}
          </Text>
          <Text note>
            {question_view_count + 2} {loc('views')}
          </Text>
        </View>
      </ListItem>
    );
  }
);
export default function RelatedQuestionList({ question_id }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  function goToQuestion(qid) {
    navigation.pop();
    navigation.navigate('QuestionDetails', {
      question_id: qid,
    });
  }
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      axios
        .get(`questions/related/${question_id}`)
        .then((res) => res.data)
        .then((d) => {
          if (isMounted) {
            setData(d);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setData([]);
            setLoading(false);
          }
        });
      return () => {
        isMounted = false;
      };
    }, [question_id])
  );
  if (loading) return <ActivityIndicator size="large" color="#16756d" />;
  return (
    <>
      <Text style={styles.header}>{loc('rl_qn')}</Text>
      {data.length > 0 ? (
        data.map((item) => (
          <QItem key={item.question_id} {...item} goToQuestion={goToQuestion} />
        ))
      ) : (
        <Text note style={{ textAlign: 'center', marginVertical: 15 }}>
          No related questions found
        </Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    paddingTop: 15,
  },
  body: { flex: 1, width: '100%', flexDirection: 'column' },
  footer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    marginTop: 5,
  },
});
