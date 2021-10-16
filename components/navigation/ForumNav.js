import React, { useState, useRef, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Badge,
  ScrollableTab,
  Text,
  Button,
  Icon,
} from 'native-base';
import QuestionList from '../Forum/QuestionList';
import GlobalHeader from './GlobalHeader';
import { StyleSheet } from 'react-native';
import axios from '../../axios';
import loc from '../../localization/loc';

export default function ForumNav() {
  const [offerCount, setOfferCount] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  useEffect(() => {
    axios
      .get(`offer_count`)
      .then((r) => r.data)
      .then((d) => setOfferCount(d.ofr))
      .catch((e) => {
        setOfferCount(0);
        console.log(e);
      });
    return () => setOfferCount(0);
  }, []);
  function handleScroll({ nativeEvent }) {
    setOffsetY(nativeEvent.contentOffset.y);
  }
  function toTop() {
    scrRef?.scrollToOffset?.({ animated: true, offset: 0 });
  }
  let scrRef = useRef(null);
  return (
    <>
      <GlobalHeader hideNavBar={offsetY > 60} />
      <Tabs
        renderTabBar={() => (
          <ScrollableTab tabsContainerStyle={styles.primaryBg} />
        )}
        onChangeTab={toTop}>
        <Tab heading={loc('home')}>
          <QuestionList
            handleScroll={handleScroll}
            setRef={(r) => (scrRef = r)}
            type="home"
          />
        </Tab>
        <Tab heading={loc('all_q')}>
          <QuestionList
            handleScroll={handleScroll}
            setRef={(r) => (scrRef = r)}
            type="all"
          />
        </Tab>
        <Tab
          heading={
            <>
              <Text>{loc('offered')}</Text>
              {offerCount > 0 && (
                <Badge style={styles.ofrBadge}>
                  <Text style={styles.ofrCount}>{offerCount}</Text>
                </Badge>
              )}
            </>
          }>
          <QuestionList
            handleScroll={handleScroll}
            setRef={(r) => (scrRef = r)}
            type="offered"
          />
        </Tab>
        <Tab heading={loc('blogs')}>
          <QuestionList
            handleScroll={handleScroll}
            setRef={(r) => (scrRef = r)}
            type="blogs"
          />
        </Tab>
        <Tab heading={loc('an_q')}>
          <QuestionList
            handleScroll={handleScroll}
            setRef={(r) => (scrRef = r)}
            type="answered"
          />
        </Tab>
        <Tab heading={loc('un_q')}>
          <QuestionList
            handleScroll={handleScroll}
            setRef={(r) => (scrRef = r)}
            type="unanswered"
          />
        </Tab>
      </Tabs>
      {offsetY > 60 && (
        <Button rounded icon style={styles.toTop} onPress={toTop}>
          <Icon name="arrow-up" />
        </Button>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  brand: {
    color: '#fafafa',
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  searchBtn: {
    flex: 1,
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
  },
  primaryBg: { backgroundColor: '#16756d' },
  ofrBadge: {
    backgroundColor: '#efefef',
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
    height: 20,
  },
  ofrCount: {
    color: '#16756d',
    fontWeight: 'bold',
  },
  toTop: {
    position: 'absolute',
    zIndex: 10,
    bottom: 10,
    right: 10,
    opacity: 0.8,
  },
});
