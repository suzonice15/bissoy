import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { H3, Icon, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import NotificationItem from './NotificationItem';
import axios from '../../axios';
import { AuthContext } from '../../contextHandler';
let page = 1;
export default function NotificationList() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const {
    authContext: { registerNewNotif },
  } = useContext(AuthContext);
  async function fetchNotif(refreshing = false) {
    if (refreshing) page = 1;
    else setLoading(true);
    try {
      const res = await axios.get(`notifications?page=${page++}`);
      if (res.status === 200) {
        setData(res.data.data || []);
        const newCount = (res.data.data || []).filter((d) => d.seen === 0)
          .length;
        registerNewNotif(newCount);
      }
    } catch (e) {
      console.log(e.message || 'Notif load failed');
      //DO NOTHING
    }
    setLoading(false);
  }
  useEffect(() => {
    fetchNotif();
    return () => {
      setLoading(true);
      setData([]);
      page = 1;
    };
  }, []);
  function handleDelete(id) {
    setData(data.filter((d) => d.notification_id !== id));
  }
  function handleSeen(id, sn) {
    setData(data.map((d) => ({ ...d, seen: d.id !== id ? d.seen : sn })));
  }
  function renderItem({ item }) {
    return (
      <NotificationItem
        {...item}
        handleDelete={handleDelete}
        handleSeen={handleSeen}
      />
    );
  }
  return (
    <SafeAreaView style={styles.flexOne}>
      <View style={styles.header}>
        <Button transparent large onPress={() => navigation.openDrawer()}>
          <Icon name="menu" style={styles.menu} />
        </Button>
        <H3 style={styles.headerText}>Notifications</H3>
      </View>
      {loading ? (
        <ActivityIndicator color="#16756d" size="large" />
      ) : (
        <FlatList
          style={styles.flexOne}
          data={data}
          keyExtractor={({ notification_id }) => notification_id.toString()}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={() => fetchNotif(true)}
          onEndReached={fetchNotif}
          onEndReachedThreshold={0.5}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16756d',
    height: 60,
    elevation: 5,
  },
  headerText: {
    fontWeight: 'bold',
    margin: 10,
    color: '#fefefe',
  },
  menu: {
    color: '#fefefe',
    fontSize: 26,
  },
});
