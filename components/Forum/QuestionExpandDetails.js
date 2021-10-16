import React, { useState, memo, useEffect } from 'react';
import { Text, H3, Thumbnail, Icon, Button, Toast } from 'native-base';
import HTML from 'react-native-render-html';
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import axios from '../../axios';
import dateFormat from '../../custom/dateFormat';
import FooterBtn from '../../custom/FooterBtn';
import { useNavigation } from '@react-navigation/native';
import QuestionItemContext from '../../custom/QuestionItemContext';
import OfferDetails from './OfferDetails';
import { decode } from 'html-entities';
import loc from '../../localization/loc';

const HTML_CONFIG = {
  onLinkPress: (_, href) => {
    Linking.openURL(href);
  },
  tagsStyles: { p: { fontSize: 16, marginVertical: 2 } },
  alterNode: (node) => {
    node.attribs = {
      ...(node.attribs || {}),
      style: `font-size:18;line-height:26;`,
    };
    return node;
  },
};

const QuestionExpandDetails = memo(
  ({
    askToLogin,
    currentUser,
    question_id,
    user_id,
    dp_62,
    title,
    description,
    feature_image,
    username,
    full_name,
    not_for_ans,
    question_up_vote,
    question_view_count,
    tagline,
    following,
    voted,
    bookmarked = 0,
    offered = 0,
    anonymous,
    created_at,
  }) => {
    const navigation = useNavigation();
    const [isFollowing, setFollowing] = useState(false);
    const [isBookmarked, toggleBookmarked] = useState(false);
    const [upvoted, setUpvoted] = useState(false);
    const [upvoteCount, incUpvoteCount] = useState(0);

    useEffect(() => {
      setUpvoted(voted == 1);
      setFollowing(following == 1);
      setFollowing(bookmarked == 1);
      incUpvoteCount(+question_up_vote || 0);
    }, []);

    async function vote() {
      if (askToLogin?.()) return;
      const _upvoted = upvoted;
      setUpvoted(!_upvoted);
      incUpvoteCount(upvoteCount + (_upvoted ? -1 : 1));
      try {
        const res = await axios.post(`q/${question_id}/vote`);
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
        const res = await axios.post(`q/${question_id}/bookmark`);
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
    async function follow() {
      if (askToLogin?.()) return;
      const _isFollowing = isFollowing;
      setFollowing(!_isFollowing);
      Toast.show({
        text: _isFollowing
          ? `Unfollowed ${username}!`
          : `Following ${username}!`,
        textStyle: { fontWeight: 'bold' },
        type: _isFollowing ? '' : 'success',
        duration: 2000,
      });
      try {
        const res = await axios.post(`user/${user_id}/follow`);
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
    function goToProfile() {
      if (anonymous == 1) return;
      navigation.navigate('Profile', {
        screen: 'ProfilePage',
        params: { user_id },
      });
    }
    function openRewardModal(gft) {
      if (askToLogin?.()) return;
      navigation.navigate('RewardModal', {
        gifted_for: gft,
        gifted_to: user_id,
        question_id: question_id,
        entity_id: question_id,
        toUsername: username,
      });
    }
    return (
      <View style={styles.mainContainer}>
        {offered == 1 && <OfferDetails question_id={question_id} />}
        <View style={styles.titleContainer}>
          <H3 selectable style={styles.title}>
            {title}
          </H3>
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
          <View
            style={{ flexDirection: 'column', flex: 1, marginHorizontal: 7 }}>
            {anonymous != 1 ? (
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <TouchableOpacity activeOpacity={0.6} onPress={goToProfile}>
                  <Text style={{ color: '#555', fontSize: 18 }}>
                    {full_name || username}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={{ color: '#555' }}>Anonymous</Text>
            )}
            <Text note>{dateFormat(created_at)}</Text>
          </View>
          {currentUser != user_id && anonymous != 1 && (
            <Button rounded transparent onPress={follow}>
              <Icon
                style={{ color: isFollowing ? 'dodgerblue' : 'grey' }}
                type="Feather"
                name={`user-${isFollowing ? 'check' : 'plus'}`}
              />
            </Button>
          )}
        </View>
        {!!description && description.trim() !== '' && (
          <View style={styles.descriptionContainer}>
            {!!feature_image && (
              <View style={{ width: '100%' }}>
                <Image
                  style={styles.ftPhoto}
                  source={{ uri: `https://www.bissoy.com/${feature_image}` }}
                />
              </View>
            )}
            <HTML
              source={{
                html: `<div>
                ${decode(description)}
              </div>`,
              }}
              imagesMaxWidth={Dimensions.get('window').width}
              {...HTML_CONFIG}
            />
          </View>
        )}
        {not_for_ans == 1 && tagline && tagline.length > 0 && (
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
            {not_for_ans != 1 ? (
              offered != 1 && (
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
                noCount
                onPress={() => openRewardModal('blog')}
              />
            )}
          </View>
          <View style={styles.footerContainer}>
            <Text note style={{ marginRight: 15 }}>
              {question_view_count} {loc('views')}
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
      </View>
    );
  }
);
export default QuestionExpandDetails;

const styles = StyleSheet.create({
  mainContainer: {
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
    alignItems: 'flex-start',
  },
  ftPhoto: {
    flex: 1,
    width: '100%',
    minHeight: 280,
    resizeMode: 'contain',
  },
  descriptionContainer: {
    margin: 5,
    overflow: 'hidden',
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
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
