import React, { useState, useEffect } from 'react';
import { Text, H3, Thumbnail, Button, Toast, Icon } from 'native-base';
import HTML from 'react-native-render-html';
import { decode } from 'html-entities';
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';
import axios from '../../axios';
import dateFormat from '../../custom/dateFormat';
import FooterBtn from '../../custom/FooterBtn';
import { useNavigation } from '@react-navigation/native';
import ViewMoreOverlay from '../../custom/ViewMoreOverlay';
import QuestionItemContext from '../../custom/QuestionItemContext';

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

const QuestionListItem = ({
  askToLogin,
  currentUser,
  onUserFollowed,
  question_id,
  user_id,
  dp_62,
  title,
  description,
  feature_image,
  username,
  full_name,
  ans_count,
  not_for_ans,
  question_up_vote,
  question_view_count,
  voted,
  pinned = 0,
  bookmarked = 0,
  anonymous,
  following,
  offered,
  accepted = 0,
  created_at,
}) => {
  const details = {
    currentUser,
    question_id,
    user_id,
    dp_62,
    title,
    description,
    feature_image,
    username,
    full_name,
    ans_count,
    not_for_ans,
    question_up_vote,
    question_view_count,
    voted,
    bookmarked,
    anonymous,
    following,
    offered,
    accepted,
    created_at,
  };
  const navigation = useNavigation();
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, incUpvoteCount] = useState(0);
  const [itemHeight, setItemHeight] = useState(0);
  const [showFull, setShowFull] = useState(false);
  const [isFollowing, setFollowing] = useState(false);

  useEffect(() => {
    setUpvoted(+voted === 1);
    incUpvoteCount(+question_up_vote);
    setFollowing(+following === 1);
  }, []);
  useEffect(() => {
    setFollowing(+following === 1);
  }, [following]);
  async function follow() {
    if (askToLogin?.()) return;
    const _isFollowing = isFollowing;
    setFollowing(!_isFollowing);
    Toast.show({
      text: _isFollowing ? `Unfollowed ${username}!` : `Following ${username}!`,
      textStyle: { fontWeight: 'bold' },
      type: _isFollowing ? '' : 'success',
      duration: 2000,
    });
    try {
      const res = await axios.post(`user/${user_id}/follow`);
      if (res.status !== 200) {
        setFollowing(_isFollowing);
        Toast.show({
          text: `Follow failed! ERR::C2XX`,
          type: 'danger',
          duration: 2000,
        });
      } else {
        onUserFollowed(user_id, !isFollowing);
      }
    } catch (e) {
      console.log(e);
      setFollowing(_isFollowing);
      Toast.show({
        text: `Follow failed! ERR::S5XX`,
        type: 'danger',
        duration: 2000,
      });
    }
  }
  async function vote() {
    if (askToLogin?.()) return;
    const _upvoted = upvoted;
    setUpvoted(!_upvoted);
    incUpvoteCount(upvoteCount + (_upvoted ? -1 : 1));
    try {
      const res = await axios.post(`q/${question_id}/vote`);
      if (res.status !== 200) {
        setUpvoted(_upvoted);
        incUpvoteCount(upvoteCount - (_upvoted ? -1 : 1));
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
      console.log(e);
      Toast.show({
        text: 'Vote failed! ERR::S5XX',
        type: 'danger',
        duration: 2000,
      });
    }
  }
  async function bookmark() {
    if (askToLogin?.()) return;
    const res = await axios.post(`q/${question_id}/bookmark`);
    Toast.show({
      text: `Bookmarked!`,
      type: 'success',
      duration: 2000,
    });
    if (res.status !== 200) {
      Toast.show({
        text: `Bookmark failed! ERR::C2XX`,
        type: 'danger',
        duration: 2000,
      });
    }
  }
  function goToProfile() {
    if (anonymous == 1) return;
    navigation.navigate('Profile', {
      screen: 'ProfilePage',
      params: { user_id },
    });
  }
  function triggerNavigate() {
    navigation.navigate('QuestionExpand', {
      ...details,
    });
  }
  function showFullDescription() {
    setShowFull(true);
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
        {anonymous != 1 && user_id != currentUser && (
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
      {pinned != 1 && !!description && description.trim() !== '' && (
        <View
          style={[
            styles.descriptionContainer,
            { maxHeight: !showFull ? 200 : '100%' },
          ]}
          onLayout={({ nativeEvent }) =>
            setItemHeight(nativeEvent.layout.height)
          }>
          <HTML
            source={{
              html: `<div>
                ${
                  not_for_ans === 1
                    ? `<img src="https://www.bissoy.com/${feature_image}" width="100%"/>`
                    : ''
                }
                ${decode(description.trim())}
              </div>`,
            }}
            ignoredStyles={['text-align']}
            imagesMaxWidth={Dimensions.get('window').width}
            {...HTML_CONFIG}
          />
          {!showFull && itemHeight >= 190 && (
            <ViewMoreOverlay revealContent={showFullDescription} />
          )}
        </View>
      )}
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
          {not_for_ans != 1 && (
            <FooterBtn
              type="MaterialCommunityIcons"
              name={`comment-text${ans_count > 1 ? '-multiple-' : '-'}outline`}
              count={ans_count}
            />
          )}
          {not_for_ans == 1 && (
            <FooterBtn
              type="AntDesign"
              name={`gift`}
              noCount
              onPress={() => {
                navigation.navigate('RewardModal', {
                  gifted_for: 'blog',
                  gifted_to: user_id,
                  entity_id: question_id,
                  toUsername: username,
                });
              }}
            />
          )}
          {offered == 1 && (
            <FooterBtn
              type="FontAwesome"
              name={`gift`}
              noCount
              highlighted
              highlightColor={accepted == 1 ? '#aaa' : '#6c6'}
              onPress={triggerNavigate}
            />
          )}
        </View>
        <View style={styles.footerContainer}>
          {pinned == 1 && (
            <FooterBtn type="AntDesign" name={`pushpin`} highlighted noCount />
          )}
          <Text note style={{ marginRight: 15 }}>
            {question_view_count} views
          </Text>
          <QuestionItemContext
            simplified
            question_id={question_id}
            isBookmarked={bookmarked == 1}
            toggleBookmark={bookmark}
            authenticated={currentUser == user_id}
            message={title}
            url={`https://www.bissoy.com/q/${question_id}`}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.ans_count === nextProps.ans_count &&
    prevProps.following === nextProps.following
  );
};

export default React.memo(QuestionListItem, areEqual);

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
  descriptionContainer: {
    margin: 5,
    overflow: 'hidden',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
