import React from 'react';
import { Text, H3, Thumbnail } from 'native-base';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import dateFormat from '../../custom/dateFormat';
import { useNavigation } from '@react-navigation/native';

const SimpleQuestionListItem = ({
  question_id,
  user_id,
  dp_62,
  title,
  username,
  full_name,
  ans_count,
  question_view_count,
  anonymous,
  created_at,
}) => {
  const navigation = useNavigation();
  function goToProfile() {
    if (anonymous == 1) return;
    navigation.navigate('Profile', {
      screen: 'ProfilePage',
      params: { user_id },
    });
  }
  function triggerNavigate() {
    navigation.navigate('QuestionDetails', { question_id, justAdded: false });
  }
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.mainContainer}
      onPress={triggerNavigate}>
      <View style={styles.titleContainer}>
        <H3 style={styles.title}>{title}</H3>
      </View>
      <View style={styles.credentialsContainer}>
        <TouchableOpacity activeOpacity={0.6} onPress={goToProfile}>
          <Thumbnail
            small
            source={{
              uri: `https://www.bissoy.com/${
                anonymous != 1
                  ? dp_62 || 'media/images/default/avatar.jpg'
                  : 'media/images/default/avatar.jpg'
              }`,
            }}
          />
        </TouchableOpacity>
        <View style={styles.nameTimestampContainer}>
          {anonymous != 1 ? (
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <TouchableOpacity activeOpacity={0.6} onPress={goToProfile}>
                <Text style={styles.name}>{full_name || username}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={{ color: '#555' }}>Anonymous</Text>
          )}
          <Text note>{dateFormat(created_at)}</Text>
        </View>
      </View>
      <View style={styles.footerContainer}>
        <Text note>
          {ans_count} {ans_count > 1 ? 'answers' : 'answer'}
        </Text>
        <Text note>{question_view_count} views</Text>
      </View>
    </TouchableOpacity>
  );
};

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.ans_count === nextProps.ans_count
  );
};

export default React.memo(SimpleQuestionListItem, areEqual);

const styles = StyleSheet.create({
  mainContainer: {
    margin: 0,
    padding: 0,
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 6,
  },
  titleContainer: {
    margin: 7,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  credentialsContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    alignItems: 'flex-start',
  },
  nameTimestampContainer: {
    flexDirection: 'column',
    flex: 1,
    marginHorizontal: 7,
  },
  name: { color: '#555', fontSize: 17 },

  footerContainer: {
    padding: 5,
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
