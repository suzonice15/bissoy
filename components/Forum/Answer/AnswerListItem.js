import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import axios from '../../../axios';
import FooterBtn from '../../../custom/FooterBtn';
import HTML from 'react-native-render-html';
import { Text, Thumbnail, Toast, Button, Icon } from 'native-base';
import dateFormat, { timeDistance } from '../../../custom/dateFormat';
import AnswerItemContext from '../../../custom/AnswerItemContext';
import AnswerComment from '../Comment/AnswerComment';
import { useNavigation } from '@react-navigation/native';
import loc from '../../../localization/loc';
import RewardsList from './RewardsList';

const HTML_CONFIG = {
  onLinkPress: (_, href) => {
    Linking.openURL(href);
  },
  tagsStyles: { p: { fontSize: 16, marginVertical: 2 } },
  alterNode: (node) => {
    node.attribs = { ...(node.attribs || {}), style: `font-size: 18;` };
    return node;
  },
};

const AnswerListItem = ({
  answer = {},
  current_user = null,
  offered,
  requestDelete,
  askToLogin,
  selectByID,
  oneSelected,
  canSelect = false,
}) => {
  const [upvoted, setUpvoted] = useState(answer.voted == 1);
  const [downvoted, setDownvoted] = useState(answer.voted == -1);
  const [isFollowing, setFollowing] = useState(answer.following == 1);
  const [original, setOriginal] = useState(answer.original == 1);
  const [upvoteCount, incUpvoteCount] = useState(+answer.answer_up_vote);
  const [selected, toggleSelected] = useState(answer.selected == 1);
  const [collapsed, toggleCollapsed] = useState(answer.under_review == 1);
  const [showComments, toggleShowComments] = useState(false);
  const navigation = useNavigation();
  const canSetOriginal = timeDistance(answer.created_at) <= 15;
  async function vote() {
    if (askToLogin?.()) return;
    const _upvoted = upvoted;
    const _upvoteCount = upvoteCount;
    setUpvoted(!_upvoted);
    setDownvoted(false);
    incUpvoteCount(_upvoteCount + (_upvoted ? -1 : 1));
    try {
      const res = await axios.post(`a/${answer.answer_id}/vote`);
      if (res.status !== 200) {
        setUpvoted(_upvoted);
        incUpvoteCount(_upvoteCount);
        setDownvoted(answer.voted < 0);
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
      incUpvoteCount(_upvoteCount);
      console.log(e);
      Toast.show({
        text: `Vote failed! ERR::S5XX`,
        type: 'danger',
        duration: 2000,
      });
    }
  }
  async function downvote() {
    if (askToLogin?.()) return;
    const _upvoted = upvoted;
    const _downvoted = downvoted;
    setUpvoted(false);
    setDownvoted(!_downvoted);
    incUpvoteCount(upvoteCount + (_upvoted ? -1 : 0));
    try {
      const res = await axios.post(`a/${answer.answer_id}/downvote`);
      if (res.status !== 200) {
        setUpvoted(_upvoted);
        setDownvoted(_downvoted);
        incUpvoteCount(upvoteCount - (_upvoted ? -1 : 0));
        Toast.show({
          text: `Downvote failed! ERR::C2XX`,
          type: 'danger',
          duration: 2000,
        });
      }
    } catch (e) {
      setUpvoted(_upvoted);
      incUpvoteCount(upvoteCount - (_upvoted ? -1 : 0));
      Toast.show({
        text: `Downvote failed! ERR:S5XX`,
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
        ? `Unfollowed ${answer.username}!`
        : `Following ${answer.username}!`,
      textStyle: { fontWeight: 'bold' },
      type: _isFollowing ? '' : 'success',
      duration: 2000,
    });
    try {
      const res = await axios.post(`user/${answer.user_id}/follow`);
      if (res.status !== 200) {
        setFollowing(_isFollowing);
        Toast.show({
          text: `Follow failed! ERR::C2XX`,
          type: 'danger',
          duration: 2000,
        });
      }
    } catch (e) {
      console.log(e);
      setFollowing(_isFollowing);
      Toast.show({
        text: `Follow failed! ERR::S2XX`,
        type: 'danger',
        duration: 2000,
      });
    }
  }
  useEffect(() => {
    toggleSelected(answer.selected == 1);
  }, [oneSelected]);
  async function selectAnswer() {
    if (offered == 1 && selected) {
      Toast.show({
        text: `Only admins can deselect offered answer!`,
        type: 'warning',
        duration: 2000,
      });
      return;
    }
    if (!canSelect) {
      Toast.show({
        text: `You don't have the permission to select the answer!`,
        type: 'warning',
        duration: 2000,
      });
      return;
    }
    const _selected = selected;
    selectByID(_selected ? 0 : answer.answer_id);
    toggleSelected(!_selected);
    try {
      const res = await axios.post(`a/${answer.answer_id}/select`);
      if (res.status === 200) {
        Toast.show({
          text: `Answer ${_selected ? 'deselected' : 'selected'}!`,
          type: _selected ? '' : 'success',
          duration: 2000,
        });
      } else {
        Toast.show({
          text: `Answer selection failed! ERR::C2XX`,
          type: 'danger',
          duration: 2000,
        });
        toggleSelected(_selected);
      }
    } catch (e) {
      Toast.show({
        text: `Answer selection failed! ERR::S5XX`,
        type: 'danger',
        duration: 2000,
      });
      toggleSelected(_selected);
    }
  }
  function goToProfile() {
    if (answer.anonymous == 1) return;
    navigation.navigate('Profile', {
      screen: 'ProfilePage',
      params: { user_id: answer.user_id },
    });
  }
  function markOriginal() {
    Alert.alert(
      loc('mark_original.title'),
      loc('mark_original.message'),
      [
        {
          text: 'Mark as Original',
          style: 'default',
          onPress: async () => {
            setOriginal(true);
            try {
              await axios.post(`a/${answer.answer_id}/original`);
              Toast.show({
                text: `Answer was marked as original!`,
                type: 'success',
                duration: 2000,
              });
            } catch (e) {
              setOriginal(false);
              Toast.show({
                text: `Failed to mark as original! ERR::S5XX`,
                type: 'danger',
                duration: 2000,
              });
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  }

  if (collapsed) {
    return (
      <TouchableOpacity
        style={[styles.answerContainer, { padding: 5, alignItems: 'center' }]}>
        <Text>
          This answer was collapsed due to possible violation of the rules.
        </Text>
        <Button danger transparent onPress={() => toggleCollapsed(false)}>
          <Text>Click to Reveal</Text>
        </Button>
      </TouchableOpacity>
    );
  }
  return (
    <>
      <View
        style={[
          styles.answerContainer,
          selected ? { borderWidth: 2, borderColor: '#01a31c' } : {},
        ]}>
        <View style={styles.credentialsContainer}>
          <TouchableOpacity
            onPress={goToProfile}
            disabled={answer.anonymous == 1}>
            <Thumbnail
              small
              source={{
                uri: `https://www.bissoy.com/${
                  answer.anonymous != 1
                    ? answer.dp_62 || 'media/images/default/avatar.jpg'
                    : 'media/images/default/avatar.jpg'
                }`,
              }}
            />
          </TouchableOpacity>
          <View style={styles.fullName}>
            {answer.anonymous != 1 ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={{ color: '#555' }} onPress={goToProfile}>
                  {answer.full_name || answer.username}
                </Text>
              </View>
            ) : (
              <Text style={{ color: '#555' }}>Anonymous</Text>
            )}
            <Text note>{dateFormat(answer.created_at)}</Text>
          </View>
          {answer.anonymous != 1 && answer.user_id != current_user && (
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
          {current_user != answer.user_id && (!oneSelected || selected) && (
            <Button rounded transparent onPress={selectAnswer}>
              <Icon
                style={{ color: '#16756d' }}
                type="AntDesign"
                name={`checkcircle${selected ? '' : 'o'}`}
              />
            </Button>
          )}
        </View>

        <View style={styles.descriptionContainer}>
          <HTML
            source={{ html: answer.answer }}
            ignoredStyles={['text-align']}
            imagesMaxWidth={Dimensions.get('window').width}
            {...HTML_CONFIG}
          />
          {answer.rewards > 0 && (
            <RewardsList count={answer.rewards} answer_id={answer.answer_id} />
          )}
          {answer.tagline && answer.tagline.length > 0 && (
            <View style={styles.signature}>
              <Text style={styles.signatureTitle}>Signature</Text>
              <Text style={styles.signatureText}>
                <Icon
                  style={{ color: '#666' }}
                  name="format-quote-open"
                  type="MaterialCommunityIcons"
                />
                {answer.tagline}
                <Icon
                  style={{ color: '#666' }}
                  name="format-quote-close"
                  type="MaterialCommunityIcons"
                />
              </Text>
            </View>
          )}
        </View>
        {!original && current_user == answer.user_id && canSetOriginal && (
          <View style={styles.markButton}>
            <Button
              rounded
              small
              style={{ justifyContent: 'center' }}
              onPress={markOriginal}>
              <Text>Mark as Original</Text>
            </Button>
          </View>
        )}
        <View style={styles.footerContainer}>
          <View style={{ flexDirection: 'row' }}>
            <FooterBtn
              type="MaterialCommunityIcons"
              name={`arrow-up-circle${!upvoted ? '-outline' : ''}`}
              highlighted={upvoted}
              count={upvoteCount}
              onPress={vote}
              color="dodgerblue"
            />
            <FooterBtn
              type="MaterialCommunityIcons"
              name={`comment${
                answer.com_count > 1 ? '-multiple-' : '-'
              }outline`}
              count={answer.com_count}
            />
            {current_user !== answer.user_id && (
              <FooterBtn
                type="AntDesign"
                name={`gift`}
                highlighted
                highlightColor="#f55"
                noCount
                onPress={() =>
                  navigation.navigate('RewardModal', {
                    gifted_for: 'answer',
                    gifted_to: answer.user_id,
                    entity_id: answer.answer_id,
                    question_id: answer.question_id,
                    toUsername: answer.username,
                  })
                }
              />
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text note style={{ marginRight: 15 }}>
              {answer.answer_read_count} {loc('views')}
            </Text>
            <AnswerItemContext
              answer_id={answer.answer_id}
              question_id={answer.question_id}
              authenticated={current_user === parseInt(answer.user_id)}
              downvoted={downvoted}
              downvote={downvote}
              requestDelete={requestDelete}
              message={answer.answer}
              url={`https://www.bissoy.com/q/${answer.question_id}`}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => toggleShowComments(!showComments)}
          style={styles.commentsBtn}>
          <Text note>
            <Text note>
              {!showComments
                ? `${loc('show_c')} (${answer.com_count})`
                : loc('hide_c')}
            </Text>
          </Text>
        </TouchableOpacity>
        {showComments && (
          <AnswerComment askToLogin={askToLogin} answer_id={answer.answer_id} />
        )}
      </View>
      <View style={styles.divider} />
    </>
  );
};
const areEqual = (prevProps, nextProps) => {
  return (
    Object.keys(prevProps.answer).length ===
    Object.keys(nextProps.answer).length
  );
};
export default React.memo(AnswerListItem, areEqual);

const styles = StyleSheet.create({
  answerContainer: {
    margin: 0,
    padding: 0,
  },
  titleContainer: {
    margin: 7,
  },
  credentialsContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  credentialsName: {
    flex: 1,
    marginHorizontal: 7,
    flexDirection: 'column',
  },
  fullName: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-start',
    marginHorizontal: 7,
  },
  descriptionContainer: {
    margin: 5,
  },
  signature: {
    elevation: 2,
    margin: 2,
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
  markButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  commentsBtn: {
    backgroundColor: '#fafafa',
    padding: 10,
    borderTopColor: '#efefef',
    borderTopWidth: 1,
  },
  footerContainer: {
    flexDirection: 'row',
    margin: 7,
    justifyContent: 'space-between',
  },
  divider: {
    backgroundColor: '#e6e6e6',
    height: 6,
  },
});
