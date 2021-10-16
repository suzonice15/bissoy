import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ListItem, Thumbnail, View, Text, Icon } from 'native-base';
import axios from '../../../axios';
import { useNavigation } from '@react-navigation/native';

export default function Following() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigator = useNavigation();
  async function fetchFollowing() {
    setLoading(true);
    try {
      const res = await axios.get('user/following');
      if (res.status === 200) {
        setData(res.data.data);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchFollowing();
  }, []);

  const renderItem = ({ item }) => (
    <ListItem
      style={styles.spaceBetween}
      onPress={() =>
        navigator.navigate('Profile', {
          screen: 'ProfilePage',
          params: {
            user_id: item.user_id,
          },
        })
      }>
      <Thumbnail
        small
        source={{
          uri: `https://www.bissoy.com/${
            item.dp_62 || 'media/images/default/avatar.jpg'
          }`,
        }}
        style={{ marginRight: 5 }}
      />
      <Text style={styles.flexOne}>{item.username}</Text>
      <Text note>{item.followed_on.slice(0, 10)}</Text>
    </ListItem>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.user_id}
      refreshing={loading}
      onRefresh={fetchFollowing}
      ListHeaderComponent={() => (
        <ListItem style={styles.spaceBetween}>
          <Text style={styles.dataNumH}>Name</Text>
          <Text style={styles.dataNumH}>Since</Text>
        </ListItem>
      )}
    />
  );
}

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  spaceBetween: { justifyContent: 'space-between' },
  dataNumH: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
