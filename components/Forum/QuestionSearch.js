import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Keyboard, Dimensions } from 'react-native';
import { View, Text, Icon, List, ListItem, Spinner } from 'native-base';
import axios from '../../axios';
import { useNavigation } from '@react-navigation/native';

const deviceHeight = Dimensions.get('window').height;

export default function QuestionSearch({ title = '' }) {
  const navigation = useNavigation();
  const [titleList, setTitleList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSimilar() {
      if (loading) return;
      if (title.length < 3) {
        setTitleList([]);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.post(`similar_titles/20`, { title });
        if (res.status === 200) {
          setTitleList(res.data);
        } else {
          setTitleList([]);
        }
      } catch (e) {
        setTitleList([]);
        throw e;
      }
      setLoading(false);
    }
    fetchSimilar();
  }, [title]);

  useEffect(() => {
    const unsub = navigation.addListener('blur', () => {
      setTitleList([]);
      setLoading(false);
      Keyboard.dismiss();
    });
    return unsub;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {loading ? (
        <Spinner color="#16756d" />
      ) : titleList.length > 0 ? (
        <ScrollView style={{ flex: 1 }}>
          <List>
            {titleList.map(
              ({ title, question_id, ans_count, question_view_count }, idx) => (
                <ListItem
                  key={question_id}
                  noIndent
                  style={[
                    styles.listItem,
                    { borderBottomWidth: titleList.length - 1 !== idx ? 2 : 0 },
                  ]}
                  onPress={() =>
                    navigation.navigate('QuestionDetails', { question_id })
                  }>
                  <View
                    style={{
                      width: '100%',
                    }}>
                    <Text>{title}</Text>
                  </View>
                  <View style={styles.listFooter}>
                    <Text note>{ans_count} answers</Text>
                    <Text note>{question_view_count} views</Text>
                  </View>
                </ListItem>
              ),
            )}
          </List>
          <View style={{ height: 60 }} />
        </ScrollView>
      ) : (
        <View style={styles.initContainer}>
          <Icon
            ios="ios-search"
            android="md-search"
            style={{ color: '#999', fontSize: 42 }}
          />
          {title.length === 0 ? (
            <Text style={styles.iHeaders}>Start typing to search.</Text>
          ) : (
            <Text style={styles.iHeaders}>
              We couldn't find the question you are looking for.
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    marginTop: 60,
    height: deviceHeight - 60,
    width: '100%',
    backgroundColor: '#fafafa',
    zIndex: 10,
    elevation: 5,
  },
  initContainer: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
  },
  listItem: {
    borderBottomColor: '#ddd',
    flexDirection: 'column',
  },
  listFooter: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 4,
    justifyContent: 'space-between',
  },
  iHeaders: { color: '#999', textAlign: 'center', fontSize: 18 },
});

/* <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      height,
      marginBottom: 10,
      padding: 5,
      backgroundColor: '#fefefe',
      elevation: 6,
      borderRadius: 0,
    }}>
    <Input
      multiline
      placeholder="What are you looking for?"
      placeholderTextColor="#666"
      style={{ height: Math.max(60, height) }}
      value={title}
      blurOnSubmit
      onChangeText={setTitle}
      onContentSizeChange={({ nativeEvent }) =>
        setHeight(nativeEvent.contentSize.height)
      }
      autoFocus
    />
    <Text
      style={{
        color: '#16756d',
        fontSize: 18,
        fontWeight: 'bold',
      }}
      onPress={() =>
        navigation.navigate('Ask', {
          screen: 'ChooseTitle',
          params: { cTitle: title },
        })
      }>
      Tap here
    </Text>{' '}
    to add it.
  </Text>
  </View> */
