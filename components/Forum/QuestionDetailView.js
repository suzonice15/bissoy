import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Linking } from 'react-native';
import axios from '../../axios';
import FooterBtn from '../../custom/FooterBtn';
import HTML from 'react-native-render-html';
import { Text, Thumbnail, H3, Toast, Button, Icon } from 'native-base';
import QuestionItemContext from '../../custom/QuestionItemContext';
import dateFormat from '../../custom/dateFormat';
import { useNavigation } from '@react-navigation/native';
import OfferDetails from './OfferDetails';
import { decode } from 'html-entities';

const HTML_CONFIG = {
  onLinkPress: (_, href) => {
    Linking.openURL(href);
  },
  tagsStyles: { p: { fontSize: 16, marginVertical: 2 } },
  alterNode: (node) => {
    node.attribs = { ...(node.attribs || {}), style: `font-size:18;` };
    return node;
  },
};

export default function QuestionDetailView({
  askToLogin,
  question,
  tags,
  user_id = 0,
}) {
  const [isFollowing, setFollowing] = useState(question.following == 1);
  const [isBookmarked, toggleBookmarked] = useState(question.bookmarked == 1);
  const [upvoted, setUpvoted] = useState(question.voted == 1);
  const [upvoteCount, incUpvoteCount] = useState(
    +question.question_up_vote || 0
  );
  const navigation = useNavigation();
  async function vote() {
    if (askToLogin?.()) return;
    const _upvoted = upvoted;
    setUpvoted(!_upvoted);
    incUpvoteCount(upvoteCount + (_upvoted ? -1 : 1));
    try {
      const res = await axios.post(`q/${question.question_id}/vote`);
      if (res.status !== 200) {
        setUpvoted(_upvoted);
        incUpvoteCount(upvoteCount + (_upvoted ? 1 : -1));
        Toast.show({
          text: `Vote failed! ERR::C2XX`,
          type: 'danger',
          duration: 2000,
        });
      } else {
        Toast.show({
          text: _upvoted ? 'Upvote removed!' : 'Upvoted',
          type: _upvoted ? '' : 'success',
          duration: 2000,
        });
      }
    } catch (e) {
      setUpvoted(_upvoted);
      incUpvoteCount(upvoteCount + (_upvoted ? 1 : -1));
      Toast.show({
        text: `Vote failed! ERR::S5XX`,
        type: 'danger',
        duration: 2000,
      });
    }
  }
  async function follow() {
    if (askToLogin?.()) return;
    const _isFollowing = isFollowing;
    setFollowing(!_isFollowing);
    const qn_user_id = question.user_id,
      username = question.username;
    Toast.show({
      text: _isFollowing ? `Unfollowed ${username}!` : `Following ${username}!`,
      textStyle: { fontWeight: 'bold' },
      type: _isFollowing ? '' : 'success',
      duration: 2000,
    });
    try {
      const res = await axios.post(`user/${qn_user_id}/follow`);
      if (res.status === 200) return;
      else {
        setFollowing(_isFollowing);
        Toast.show({
          text: `Follow failed! ERR::C2XX`,
          type: 'danger',
          duration: 2000,
        });
      }
    } catch (e) {
      setFollowing(_isFollowing);
      Toast.show({
        text: `Follow failed! ERR::S5XX`,
        type: 'danger',
        duration: 2000,
      });
    }
  }
  async function bookmark() {
    if (askToLogin?.()) return;
    const _isBookmarked = isBookmarked;
    toggleBookmarked(!_isBookmarked);
    Toast.show({
      text: _isBookmarked == 0 ? 'Bookmarked!' : 'Removed from bookmark.',
      type: 'success',
      duration: 2000,
    });
    try {
      const res = await axios.post(`q/${question.question_id}/bookmark`);
      if (res.status !== 200) {
        toggleBookmarked(_isBookmarked);
        Toast.show({
          text: `Request failed! ERR::C2XX`,
          type: 'danger',
          duration: 2000,
        });
      }
    } catch (e) {
      toggleBookmarked(_isBookmarked);
      Toast.show({
        text: `Request failed! ERR::S5XX`,
        type: 'danger',
        duration: 2000,
      });
    }
  }
  function goToProfile() {
    if (question.anonymous == 1) return;
    navigation.navigate('Profile', {
      screen: 'ProfilePage',
      params: { user_id: question.user_id },
    });
  }
  function gotoSelectTopic() {
    navigation.navigate('SelectTopic', {
      question_id: question.question_id,
      title: question.title,
      tags,
    });
  }
  function openRewardModal(ofr) {
    if (askToLogin?.()) return;
    navigation.navigate('RewardModal', {
      gifted_for: ofr,
      gifted_to: question.user_id,
      question_id: question.question_id,
      entity_id: question.question_id,
      toUsername: question.username,
    });
  }
  function gotoTopic(t) {
    navigation.navigate('TopicNav', { topic: t });
  }
  return (
    <View style={styles.questionContainer}>
      {question.offered == 1 && (
        <OfferDetails question_id={question.question_id} />
      )}
      <View style={styles.titleContainer}>
        <H3 style={styles.title}>{question.title}</H3>
      </View>
      <View style={styles.credentialsContainer}>
        <TouchableOpacity activeOpacity={0.6} onPress={goToProfile}>
          <Thumbnail
            small
            source={{
              uri: `https://www.bissoy.com/${
                question.anonymous != 1
                  ? question.dp_62 || 'media/images/default/avatar.jpg'
                  : 'media/images/default/avatar.jpg'
              }`,
            }}
          />
        </TouchableOpacity>
        <View style={styles.nameContainer}>
          {question.anonymous != 1 ? (
            <TouchableOpacity activeOpacity={0.6} onPress={goToProfile}>
              <Text style={{ color: '#555', fontSize: 18 }}>
                {question.full_name || question.username}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ color: '#555' }}>Anonymous</Text>
          )}
          <Text note>{dateFormat(question.created_at)}</Text>
        </View>
        {question.anonymous != 1 && (
          <Button rounded transparent onPress={follow}>
            <Icon
              style={{
                color: isFollowing ? 'dodgerblue' : 'grey',
              }}
              type="Feather"
              name={`user-${isFollowing ? 'check' : 'plus'}`}
            />
          </Button>
        )}
      </View>
      {!!question.description && question.description.trim() !== '' && (
        <View style={styles.descriptionContainer}>
          <HTML
            source={{
              html: `<div>
                ${
                  question.not_for_ans == 1
                    ? `<img src="https://www.bissoy.com/${question.feature_image}" width="100%"/>`
                    : ''
                }
                ${decode(question.description)}
              </div>`,
            }}
            imagesMaxWidth={Dimensions.get('window').width}
            {...HTML_CONFIG}
          />
        </View>
      )}
      {question.not_for_ans == 1 &&
        question.tagline &&
        question.tagline.length > 0 && (
          <View style={styles.signature}>
            <Text style={styles.signatureTitle}>Signature</Text>
            <Text style={styles.signatureText}>
              <Icon
                style={{ color: '#666' }}
                name="format-quote-open"
                type="MaterialCommunityIcons"
              />
              {question.tagline}
              <Icon
                style={{ color: '#666' }}
                name="format-quote-close"
                type="MaterialCommunityIcons"
              />
            </Text>
          </View>
        )}
      <View style={styles.tagsContainer}>
        <Icon
          type="AntDesign"
          name="tags"
          style={{ color: '#555', fontSize: 22 }}
        />
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag.value}
            style={styles.tagBtn}
            onPress={() => gotoTopic(tag.label)}>
            <Text style={{ color: 'white' }}>{tag.label}</Text>
          </TouchableOpacity>
        ))}
        <Button small transparent onPress={gotoSelectTopic} iconLeft>
          <Icon type="AntDesign" name="plus" />
          <Text>Add</Text>
        </Button>
      </View>
      <View style={[styles.footerContainer, { margin: 7 }]}>
        <View style={styles.footerContainer}>
          <FooterBtn
            type="MaterialCommunityIcons"
            name={`arrow-up-circle${!upvoted ? '-outline' : ''}`}
            highlighted={upvoted}
            count={upvoteCount}
            onPress={vote}
            color="dodgerblue"
          />
          {question.not_for_ans != 1 ? (
            question.offered != 1 && (
              <FooterBtn
                type="AntDesign"
                name={`gift`}
                count="Offer"
                highlighted
                highlightColor="#f77"
                onPress={() => openRewardModal('offer')}
              />
            )
          ) : (
            <FooterBtn
              type="AntDesign"
              name={`gift`}
              highlighted
              highlightColor="#f77"
              noCount
              onPress={() => openRewardModal('blog')}
            />
          )}
        </View>
        <View style={styles.footerContainer}>
          <Text note style={styles.mr15}>
            {question.question_view_count} views
          </Text>
          {!!user_id && (
            <QuestionItemContext
              simplified
              question_id={question.question_id}
              isBookmarked={isBookmarked}
              toggleBookmark={bookmark}
              authenticated={user_id == question.user_id}
              message={question.title}
              url={`https://www.bissoy.com/q/${question.question_id}`}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  questionContainer: {
    margin: 0,
    padding: 0,
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
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'column',
    flex: 1,
    marginHorizontal: 7,
    justifyContent: 'flex-end',
  },
  descriptionContainer: {
    marginHorizontal: 7,
  },
  signature: {
    elevation: 2,
    margin: 10,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  signatureTitle: {
    width: '60%',
    color: '#777',
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 2,
    marginBottom: 5,
    borderBottomColor: '#888',
    borderBottomWidth: 1,
  },
  signatureText: { color: '#444', lineHeight: 25 },
  tagsContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 7,
    flexWrap: 'wrap',
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 7,
    flexWrap: 'wrap',
  },
  tagBtn: {
    backgroundColor: 'skyblue',
    paddingVertical: 1,
    paddingHorizontal: 4,
    margin: 5,
  },
  mr15: { marginRight: 15 },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
