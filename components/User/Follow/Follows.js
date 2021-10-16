import React, { useState, useRef } from 'react';
import { Container } from 'native-base';
import { Tabs, Tab, ScrollableTab, Button, Icon } from 'native-base';
import GlobalHeader from '../../navigation/GlobalHeader';
import { StyleSheet } from 'react-native';
import Follower from './Follower';
import Following from './Following';

export default function Follows() {
  const [offsetY, setOffsetY] = useState(0);
  function handleScroll({ nativeEvent }) {
    setOffsetY(nativeEvent.contentOffset.y);
  }
  function toTop() {
    scrRef?.scrollToOffset?.({ animated: true, offset: 0 });
  }
  let scrRef = useRef(null);
  return (
    <Container>
      <GlobalHeader hideNavBar={offsetY > 60} />
      <Tabs
        renderTabBar={() => (
          <ScrollableTab tabsContainerStyle={styles.primaryBg} />
        )}
        onChangeTab={toTop}>
        <Tab heading="Followers">
          <Follower scrolling={handleScroll} />
        </Tab>
        <Tab heading="Following">
          <Following scrolling={handleScroll} />
        </Tab>
      </Tabs>
      {offsetY > 60 && (
        <Button rounded icon style={styles.toTop} onPress={toTop}>
          <Icon name="arrow-up" />
        </Button>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  primaryBg: { backgroundColor: '#16756d' },
  toTop: {
    position: 'absolute',
    zIndex: 10,
    bottom: 10,
    right: 10,
    opacity: 0.8,
  },
});
