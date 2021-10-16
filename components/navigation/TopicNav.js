import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button, Icon } from 'native-base';
import SimpleQuestionList from '../Forum/SimpleQuestionList';
import GlobalHeader from './GlobalHeader';
import { StyleSheet } from 'react-native';

export default function TopicNav({ route }) {
  const [topic, setTopic] = useState(route.params.topic);
  const [offsetY, setOffsetY] = useState(0);
  function handleScroll({ nativeEvent }) {
    setOffsetY(nativeEvent.contentOffset.y);
  }
  function toTop() {
    scrRef?.scrollToOffset?.({ animated: true, offset: 0 });
  }
  useEffect(() => {
    setTopic(route.params.topic);
  }, []);
  let scrRef = useRef(null);
  return (
    <View style={styles.flexOne}>
      <GlobalHeader hideNavBar={offsetY > 60} />
      <Text style={styles.title}>
        Questions for <Text style={styles.bold}>{topic}</Text>
      </Text>
      <SimpleQuestionList
        handleScroll={handleScroll}
        setRef={(r) => (scrRef = r)}
        type={`topic/${encodeURIComponent(topic)}`}
      />
      {offsetY > 60 && (
        <Button rounded icon style={styles.toTop} onPress={toTop}>
          <Icon name="arrow-up" />
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  title: {
    textAlign: 'center',
    fontSize: 20,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  bold: { fontSize: 20, fontWeight: 'bold' },
  toTop: {
    position: 'absolute',
    zIndex: 10,
    bottom: 10,
    right: 10,
    opacity: 0.8,
  },
});
