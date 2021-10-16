import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Keyboard } from 'react-native';
import {
  Header,
  View,
  Button,
  Text,
  Input,
  Icon,
  List,
  ListItem,
  Spinner,
  Left,
  Title,
  Body,
  Right,
} from 'native-base';
import axios from '../../../axios';
import loc from '../../../localization/loc';

export default function ChooseTitle({ navigation, route }) {
  const [title, setTitle] = useState(route?.params?.cTitle || '');
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
        const res = await axios.post(`similar_titles/15`, { title });
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
    navigation.addListener('focus', () => {
      setTitle(route?.params?.cTitle || '');
    });
    const unsub = navigation.addListener('blur', () => {
      resetStates();
    });
    return unsub;
  }, [navigation]);
  function resetStates() {
    setTitle('');
    setTitleList([]);
    setLoading(false);
  }
  function openDrawer() {
    Keyboard.dismiss();
    navigation.openDrawer();
  }
  return (
    <SafeAreaView style={styles.flexOne}>
      <Header span style={styles.flexColumn}>
        <View style={styles.menu}>
          <Left>
            <Button transparent onPress={openDrawer}>
              <Icon name="menu" style={styles.menuIcon} />
            </Button>
          </Left>
          <Body style={styles.flexOne}>
            <Title>{loc('ask_title')}</Title>
          </Body>
          <Right>
            <Button
              small
              transparent
              onPress={() => navigation.navigate('Home')}>
              <Text style={{ color: 'white' }}>{loc('cancel')}</Text>
            </Button>
          </Right>
        </View>
        <View style={styles.qnInput}>
          {title.length < 3 && (
            <Icon
              ios="ios-search"
              android="md-search"
              style={styles.searchIcon}
            />
          )}
          <Input
            placeholder={loc('title_ph')}
            placeholderTextColor="#aaa"
            value={title}
            blurOnSubmit
            onChangeText={setTitle}
            autoFocus
          />

          <Button
            small
            style={{
              marginEnd: 2,
            }}
            onPress={() =>
              navigation.navigate('FinalizeQuestion', { cTitle: title })
            }
            disabled={title.length < 3}>
            <Text>{loc('ask')}</Text>
          </Button>
        </View>
      </Header>
      {loading ? (
        <Spinner color="#16756d" />
      ) : titleList.length > 0 ? (
        <>
          <Text style={styles.message}>
            If you can't find your question below press the{' '}
            <Text style={{ color: '#16756d', fontWeight: 'bold' }}>Ask</Text>{' '}
            button on the left.
          </Text>
          <ScrollView>
            <List>
              {titleList.map(
                ({ title, question_id, ans_count, question_view_count }) => (
                  <ListItem
                    key={question_id}
                    noIndent
                    style={styles.listItem}
                    onPress={() =>
                      navigation.navigate('QuestionDetails', { question_id })
                    }>
                    <View
                      style={{
                        width: '100%',
                      }}>
                      <Text>{title}</Text>
                    </View>
                    <View style={styles.listItemFooter}>
                      <Text note>{ans_count} answers</Text>
                      <Text note>{question_view_count} views</Text>
                    </View>
                  </ListItem>
                )
              )}
            </List>
          </ScrollView>
        </>
      ) : (
        <View style={styles.noResult}>
          <Icon
            ios="ios-search"
            android="md-search"
            style={{ color: '#999', fontSize: 52 }}
          />
          <Text style={styles.noResultMessage}>
            {title.length > 2
              ? `No similar question was found.`
              : loc('ask_note')}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  flexColumn: { flexDirection: 'column' },
  menu: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  menuIcon: { color: '#fff', fontSize: 30 },
  qnInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  searchIcon: { color: '#777', marginHorizontal: 5 },
  message: {
    marginHorizontal: 15,
    marginTop: 5,
    fontSize: 14,
    fontStyle: 'italic',
    borderBottomColor: '#ddd',
    color: '#16756d',
  },
  noResult: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  noResultMessage: { color: '#999', textAlign: 'center', fontSize: 20 },
  listItem: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 2,
    flexDirection: 'column',
  },
  listItemFooter: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 4,
    justifyContent: 'space-between',
  },
});
