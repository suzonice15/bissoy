import React, { useRef, useState, useEffect } from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { View, Button, Text, H3, Input, Badge, Toast, Icon } from 'native-base';
import axios from '../../../axios';

import loc from '../../../localization/loc';

export default function SelectTopic({ navigation, route }) {
  let richText = useRef();
  const question_id = route?.params?.question_id || null;
  const _tags = route?.params?.tags || [];
  const title = route?.params?.title || null;
  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagSearchKey, setTagSearchKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!question_id) {
      Toast.show({
        text: 'Unknown question!',
        type: 'danger',
      });
      return;
    }
    if (_tags.length) {
      setSelectedTags(_tags);
      setSelectedTagIds(_tags.map((t) => t.value));
    }
    fetchTags();
    return () => {
      resetStates();
    };
  }, []);
  useEffect(() => {
    if (!loading && tagSearchKey.length > 2) {
      fetchTags();
    } else setTags([]);
  }, [tagSearchKey]);
  async function fetchTags() {
    setLoading(true);
    try {
      const res = await axios.post(`search_topic`, { topic: tagSearchKey });
      if (res.status === 200) {
        setTags(res.data);
      } else {
        setTags([]);
      }
    } catch (e) {
      setTags([]);
      throw e;
    }
    setLoading(false);
  }
  function resetStates() {
    setTags([]);
    setSelectedTags([]);
    setTagSearchKey('');
    setSelectedTagIds([]);
    setSaving(false);
    richText?.setContentHTML?.('');
  }

  async function save() {
    try {
      if (selectedTagIds.length === 0) {
        Toast.show({
          text: 'Select at least one topic!',
          duration: 2000,
          type: 'danger',
        });
        return;
      }
      setSaving(true);
      const res = await axios.post(`q/${question_id}/save_topic`, {
        tag_ids: JSON.stringify(selectedTagIds),
      });
      if (res.status === 200) {
        await navigation.navigate('QuestionDetails', {
          question_id: question_id,
          justAdded: false,
        });
      }
    } catch (e) {
      setSaving(false);
      console.log(e);
    }
  }
  function onTagRemoved(tag) {
    setSelectedTags(selectedTags.filter((t) => t.value !== tag.value));
    setSelectedTagIds(selectedTagIds.filter((t) => t != tag.value));
    setTags([tag, ...tags]);
  }
  function onTagSelected(tag) {
    setTags(tags.filter((t) => t.value !== tag.value));
    setSelectedTags([tag, ...selectedTags]);
    setSelectedTagIds([...selectedTagIds, tag.value]);
  }
  async function saveTopic() {
    setLoading(true);
    try {
      const res = await axios.post(`new_topic`, { tag: tagSearchKey });
      if (res.status === 200) {
        setTagSearchKey('');
        onTagSelected(res.data);
      } else {
        console.log('ERR::FAILED_TOPIC_CREATE');
      }
    } catch (e) {
      console.log('ERR::500FAILED_TOPIC_CREATE');
    }
    setLoading(false);
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Button style={styles.flatBtn} onPress={() => navigation.goBack()}>
          <Text>Cancel</Text>
        </Button>
        <Button style={styles.btn} onPress={save}>
          {saving ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </Button>
      </View>
      <View style={styles.titleContainer}>
        <H3 style={styles.title}>{title}</H3>
      </View>
      <View style={styles.selectedTopic}>
        <View style={styles.rowCentered}>
          <Icon type="AntDesign" name="tags" style={{ color: 'grey' }} />
          <Text style={styles.topicText}>{loc('topic')}</Text>
        </View>
        <View style={styles.suggestedTags}>
          {selectedTags.length > 0 ? (
            selectedTags.map((tag) => (
              <TouchableOpacity
                key={tag.value}
                activeOpacity={0.8}
                style={{ margin: 5 }}
                onPress={() => onTagRemoved(tag)}>
                <Badge small style={styles.selected}>
                  <Text>{tag.label}</Text>
                </Badge>
              </TouchableOpacity>
            ))
          ) : (
            <Text note>{loc('no_tag')}</Text>
          )}
        </View>
        <View style={styles.inpContainer}>
          <Input
            value={tagSearchKey}
            onChangeText={setTagSearchKey}
            placeholder={loc('search_tags') + '*'}
            placeholderTextColor="#aaa"
          />
        </View>
        <Text style={styles.suggestion}>{loc('suggestion')}</Text>
        {loading ? (
          <ActivityIndicator color="#16756d" size="large" />
        ) : (
          <>
            {tags.length > 0 && (
              <View style={styles.suggestedTags}>
                {tags.map((tag) => {
                  if (selectedTagIds.indexOf(tag.value) >= 0) return null;
                  return (
                    <TouchableOpacity
                      key={tag.value}
                      activeOpacity={0.8}
                      style={{ margin: 5 }}
                      onPress={() => onTagSelected(tag)}>
                      <Badge small style={styles.unselected}>
                        <Text>{tag.label}</Text>
                      </Badge>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            {tagSearchKey.length > 2 && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>{tagSearchKey}</Text> not
                  found?
                </Text>
                <Button
                  style={{ marginStart: 10 }}
                  info
                  small
                  onPress={saveTopic}>
                  <Text>Add</Text>
                </Button>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#16756d',
  },
  titleContainer: {
    margin: 7,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  flatBtn: { elevation: 0, borderRadius: 0 },
  inpContainer: { width: '100%', height: 50, marginVertical: 10 },
  topicText: { color: '#777', fontWeight: 'bold' },
  rowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestion: {
    color: '#777',
    fontWeight: 'bold',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#efefef',
    padding: 10,
  },
  suggestedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  selectedTopic: {
    marginTop: 15,
    marginHorizontal: 5,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  unselected: { backgroundColor: 'darkgrey' },
  selected: {
    backgroundColor: 'mediumseagreen',
  },
  btn: { elevation: 0, borderRadius: 0, justifyContent: 'center' },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
