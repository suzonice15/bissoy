import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { Facebook } from 'react-content-loader/native';
import TimelineItem from './TimelineItem';
import axios from '../../axios';
import { View, Text, Button } from 'native-base';

let mounted = false;
export default function Timeline({ user_id }) {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  async function fetchTimeline() {
    if (mounted) {
      if (currentPage === 0) setLoading(true);
      else setLoadingMore(true);
    }
    try {
      const res = await axios.get(
        `user_timeline/${user_id}?page=${currentPage}`
      );
      if (res.status === 200 && mounted) {
        setTimeline(timeline.concat(res.data.timeline));
        setMore(res.data.total > currentPage);
        setCurrentPage(Math.min(res.data.current, res.data.total) + 1);
      }
      if (mounted) {
        setLoading(false);
        setLoadingMore(false);
      }
    } catch (e) {
      if (mounted) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }
  useEffect(() => {
    mounted = true;
    fetchTimeline();
    return () => {
      mounted = false;
      setLoading(false);
    };
  }, [user_id]);

  function renderItem({ item }) {
    return <TimelineItem {...item} />;
  }
  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={{ flex: 1, margin: 10 }}>
          <Facebook />
          <Facebook />
          <Facebook />
          <Facebook />
          <Facebook />
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={timeline}
          keyExtractor={({ question_id, type }) => `${type}-${question_id}`}
          removeClippedSubviews
          maxToRenderPerBatch={6}
          renderItem={renderItem}
          ListFooterComponent={
            more ? (
              <Button
                onPress={fetchTimeline}
                style={{ flex: 1, justifyContent: 'center', margin: 10 }}>
                {!loadingMore ? (
                  <Text>Load More</Text>
                ) : (
                  <ActivityIndicator size="large" color="#fff" />
                )}
              </Button>
            ) : null
          }
        />
      )}
    </View>
  );
}
