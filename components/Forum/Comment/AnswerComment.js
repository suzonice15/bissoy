import React, { useState, useEffect, useContext } from 'react';
import { View, Thumbnail, Text, Toast, Button, Icon } from 'native-base';
import {
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../../../contextHandler';
import axios from '../../../axios';
import dateFormat from '../../../custom/dateFormat';

function Comment({
  auth = false,
  comment_id,
  comment_body,
  created_at,
  username,
  full_name,
  dp_62,
  deleteConfirmed,
}) {
  const [comment, setComment] = useState(comment_body);
  const [editing, setEditing] = useState(false);
  async function editComment() {
    if (comment.length === 0) return;
    setEditing(false);
    try {
      const res = await axios.post(`ac/${comment_id}/edit`, {
        comment_body: comment,
      });
      if (res.status !== 200) {
        setEditing(true);
        Toast.show({
          text: `Comment edit failed! ERR::C2XX`,
          type: 'danger',
          duration: 2000,
        });
      } else {
        Toast.show({
          text: `Comment edited!`,
          type: 'success',
          duration: 2000,
        });
      }
    } catch (e) {
      setEditing(true);
      Toast.show({
        text: `Comment edit failed! ERR::S5XX`,
        type: 'danger',
        duration: 2000,
      });
    }
  }
  function requestDelete() {
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
          onPress: () => deleteConfirmed(comment_id),
        },
      ],
      { cancelable: false }
    );
  }
  return (
    <>
      <View style={styles.commentContainer} />
      <View style={styles.flexRow}>
        <TouchableOpacity>
          <Thumbnail
            small
            source={{
              uri: `https://www.bissoy.com/${
                dp_62 || 'media/images/default/avatar.jpg'
              }`,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.credentials}>
          <Text style={styles.txtDark}>{full_name || username}</Text>
          <Text note>{dateFormat(created_at, 'MMM dd')}</Text>
        </TouchableOpacity>
      </View>
      {!editing ? (
        <Text style={styles.cmText}>{comment}</Text>
      ) : (
        <>
          <TextInput
            multiline
            value={comment}
            onChangeText={setComment}
            style={styles.commentInput}
          />
          <View style={styles.rowEnd}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={[
                styles.commentBtn,
                {
                  backgroundColor:
                    comment_body.length > 0 ? '#2e69ff' : '#9cb8ff',
                },
              ]}
              onPress={editComment}>
              <Text uppercase={false} style={styles.commentBtnText}>
                Edit Comment
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={[
                styles.commentBtn,
                {
                  backgroundColor: '#e7e7e7',
                  marginHorizontal: 5,
                },
              ]}
              onPress={() => setEditing(false)}>
              <Text
                uppercase={false}
                style={[styles.commentBtnText, { color: '#777' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {auth && !editing && (
        <View style={styles.rowEnd}>
          <Button transparent small onPress={() => setEditing(true)}>
            <Icon type="AntDesign" name="edit" style={styles.blueColor} />
          </Button>
          <Button transparent small onPress={requestDelete}>
            <Icon type="AntDesign" name="delete" style={styles.dangerColor} />
          </Button>
        </View>
      )}
    </>
  );
}
export default function AnswerComment({ answer_id, askToLogin }) {
  const [comment, setComment] = useState('');
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const {
    state: { user },
  } = useContext(AuthContext);
  useEffect(() => {
    async function fetchComments() {
      setDataLoading(true);
      const res = await axios.get(`ac/${answer_id}`);
      if (res.status === 200) {
        setData(res.data);
      }
      setDataLoading(false);
    }
    fetchComments();
  }, []);
  async function addComment() {
    if (askToLogin?.() || comment.length === 0) return;
    const temp_comment_id = Date.now();
    const _comment = comment;
    const new_comment = {
      comment_id: temp_comment_id,
      user_id: user?.user_id,
      comment_body: _comment,
      created_at: new Date()
        .toISOString?.()
        ?.replace(/T|Z|\.\d+/g, ' ')
        ?.trim(),
      username: user?.username,
      full_name: user?.full_name,
      dp_62: user?.dp_62,
    };
    try {
      setLoading(true);
      const res = await axios.post(`add_ac/${answer_id}`, {
        comment_body: comment,
      });
      if (res.status !== 200) {
        setComment(_comment);
        setData(data.filter((d) => d.comment_id !== temp_comment_id));
        Toast.show({
          text: `Comment failed! ERR::C2XX`,
          type: 'danger',
          duration: 2000,
        });
      } else {
        setComment('');
        setData([{ ...new_comment, comment_id: res.data.comment_id }, ...data]);
        Toast.show({
          text: `Comment added!`,
          type: 'success',
          duration: 2000,
        });
      }
    } catch (e) {
      setComment(_comment);
      setData(data.filter((d) => d.comment_id !== temp_comment_id));
      Toast.show({
        text: `Comment failed! ERR::S5XX`,
        type: 'danger',
        duration: 2000,
      });
    }
    setLoading(false);
  }
  async function handleDelete(cm_id) {
    setData(data.filter((d) => d.comment_id !== cm_id));
    try {
      const res = await axios.post(`ac/${cm_id}/delete`);
      if (res.status !== 200) {
        Toast.show({
          text: `Delete failed! ERR::C2XX`,
          type: 'danger',
          duration: 2000,
        });
      }
    } catch (e) {
      Toast.show({
        text: `Delete failed! ERR::S5XX`,
        type: 'danger',
        duration: 2000,
      });
    }
  }
  return (
    <View style={styles.mainContent}>
      <TextInput
        multiline
        placeholder="Write a comment"
        style={styles.commentInput}
        onChangeText={setComment}
        value={comment}
      />
      <View style={styles.rowEnd}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={[
            styles.commentBtn,
            { backgroundColor: comment.length > 0 ? '#2e69ff' : '#9cb8ff' },
          ]}
          onPress={addComment}
          disabled={loading}>
          <Text uppercase={false} style={styles.commentBtnText}>
            {loading ? 'Adding...' : 'Add Comment'}
          </Text>
        </TouchableOpacity>
      </View>
      {dataLoading && <ActivityIndicator color="#16756d" />}
      {data.map((cmt) => (
        <Comment
          key={cmt.comment_id}
          deleteConfirmed={handleDelete}
          auth={user?.user_id == cmt.user_id}
          {...cmt}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  rowEnd: { flexDirection: 'row', justifyContent: 'flex-end' },
  mainContent: {
    padding: 5,
    backgroundColor: '#fafafa',
  },
  commentContainer: {
    backgroundColor: '#e6e6e6',
    height: 1,
    marginVertical: 5,
  },
  commentInput: {
    flex: 1,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 30,
  },
  cmText: { color: '#444', marginTop: 7 },
  commentBtn: {
    marginVertical: 5,
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 30,
  },
  commentBtnText: { color: '#f9f9f9', fontSize: 18, fontWeight: 'bold' },
  credentials: {
    flex: 1,
    marginHorizontal: 7,
    flexDirection: 'column',
  },
  txtDark: {
    color: '#333',
  },
  dangerColor: { color: '#f55' },
  blueColor: { color: '#2e69ff' },
});
