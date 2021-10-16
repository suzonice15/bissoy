import React, { useState, memo } from 'react';
import { Text, H3 } from 'native-base';
import HTML from 'react-native-render-html';
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';
import dateFormat from '../../custom/dateFormat';
import ViewMoreOverlay from '../../custom/ViewMoreOverlay';
import QuestionItemContext from '../../custom/QuestionItemContext';
import AnswerItemContext from '../../custom/AnswerItemContext';
import loc from '../../localization/loc';
import { useNavigation } from '@react-navigation/native';

const HTML_CONFIG = {
  onLinkPress: (_, href) => {
    Linking.openURL(href);
  },
  tagsStyles: { p: { fontSize: 16, marginVertical: 2 } },
  alterNode: (node) => {
    node.attribs = { ...(node.attribs || {}), style: `;` };
    return node;
  },
};

const TimelineItem = memo(
  ({
    question_id,
    post_id,
    user_id,
    current_user,
    title,
    body,
    views,
    type,
    created_at,
  }) => {
    const [itemHeight, setItemHeight] = useState(0);
    const navigation = useNavigation();
    async function goToQn() {
      navigation.navigate('QuestionDetails', {
        question_id: question_id,
      });
    }

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.mainContainer}
        onPress={goToQn}>
        <Text style={styles.bold}>
          {type === 'a'
            ? loc('q_ans')
            : type === 'b'
            ? loc('wrote')
            : loc('q_asked')}
        </Text>
        <View style={styles.titleContainer}>
          <H3 style={styles.title}>{title}</H3>
        </View>

        {!!body && body.trim() !== '' && (
          <View
            style={styles.descriptionContainer}
            onLayout={({ nativeEvent }) =>
              setItemHeight(nativeEvent.layout.height)
            }>
            <HTML
              source={{ html: body }}
              imagesMaxWidth={Dimensions.get('window').width}
              {...HTML_CONFIG}
            />
            {itemHeight >= 190 && <ViewMoreOverlay />}
          </View>
        )}
        <View style={[styles.footerContainer, { margin: 7 }]}>
          <Text note>{dateFormat(created_at)}</Text>
          <View style={styles.footerContainer}>
            <Text note style={{ marginRight: 15 }}>
              {views} views
            </Text>
            {current_user === user_id &&
              (type === 'q' || type === 'b' ? (
                <QuestionItemContext
                  question_id={question_id}
                  authenticated={true}
                  requestDelete={() => {}}
                  message={title}
                  url={`https://www.bissoy.com/q/${question_id}`}
                  simplified
                />
              ) : (
                <AnswerItemContext
                  answer_id={post_id}
                  question_id={question_id}
                  authenticated={true}
                  simplified
                  requestDelete={() => {}}
                  message={body}
                  url={`https://www.bissoy.com/q/${question_id}`}
                />
              ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);
export default TimelineItem;

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
  bold: {
    fontWeight: 'bold',
    marginHorizontal: 7,
    marginTop: 5,
    color: '#555',
  },
  descriptionContainer: {
    marginHorizontal: 7,
    maxHeight: 200,
    overflow: 'hidden',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
