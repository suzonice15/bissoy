import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, VirtualizedList } from 'react-native';
import axios from '../../axios';
import SimpleQuestionListItem from './SimpleQuestionListItem';
import { AuthContext } from '../../contextHandler';
import ListLoaders from './loaders/ListLoaders';
import { Toast } from 'native-base';
import Reload from '../../custom/Reload';
let isMounted = false;
let currentPage = 1;
let endOfPage = false;
export default function SimpleQuestionList({
  type = 'home',
  setRef,
  handleScroll,
}) {
  const { state } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [data, setData] = useState([]);
  const [failed, toggleFailed] = useState(false);

  function askToLogin(text = 'Login Required!') {
    if (!state.user) {
      Toast.show({
        text,
        buttonText: 'Login',
        type: 'warning',
        duration: 3000,
        onClose: handleToastClose,
      });
      return true;
    }
    return false;
  }
  function handleToastClose(reason) {
    if (reason === 'user') {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  }
  async function fetchData(page = 1) {
    toggleFailed(false);
    if (isMounted) {
      if (page === 1) setLoading(true);
      else if (!endOfPage && data.length >= 10) setLoadingMore(true);
    }
    try {
      const res = await axios.get(`questions/${type}?page=${page}`);
      if (isMounted && res.status === 200) {
        if (res.data.length < 10) endOfPage = true;
        if (page === 1) {
          currentPage = 1;
          setData(res.data);
        } else {
          setData(data.concat(res.data));
        }
      } else {
        toggleFailed(true);
        Toast.show({
          text: 'Failed to load questions for ' + topic,
          type: 'warning',
          duration: 3000,
        });
        console.log(`Error at QuestionList ${res?.status}`);
      }
    } catch (e) {
      toggleFailed(true);
      Toast.show({
        text: 'Failed to load questions for ' + topic,
        type: 'warning',
        duration: 3000,
      });
    }
    if (isMounted) {
      setLoading(false);
      setLoadingMore(false);
    }
  }
  useEffect(() => {
    isMounted = true;
    if (currentPage === 1) fetchData(1);
    return () => {
      toggleFailed(false);
      if (isMounted) setData([]);
      currentPage = 1;
      isMounted = false;
    };
  }, []);

  function handleUserFollowed(uid, st) {
    const _data = data;
    setData(
      _data.map((d) => {
        if (d.user_id != uid) return d;
        return {
          ...d,
          following: st ? '1' : '0',
        };
      })
    );
  }

  function renderItem({ item }) {
    return (
      <SimpleQuestionListItem
        {...item}
        currentUser={state?.user?.user_id}
        onUserFollowed={handleUserFollowed}
        askToLogin={askToLogin}
      />
    );
  }
  const extractKey = ({ question_id }) => `q-${question_id}`;
  const getItem = (data, index) => {
    return data[index];
  };
  const getItemCount = (data) => data.length;
  return !failed ? (
    <View style={styles.list}>
      {loading ? (
        <ListLoaders />
      ) : (
        data.length !== 0 && (
          <VirtualizedList
            ref={setRef}
            onScroll={handleScroll}
            scrollEventThrottle={5}
            style={styles.list}
            data={data}
            keyExtractor={extractKey}
            getItem={getItem}
            getItemCount={getItemCount}
            removeClippedSubviews
            maxToRenderPerBatch={6}
            renderItem={renderItem}
            refreshing={loading}
            onRefresh={async () => fetchData()}
            onEndReached={() => fetchData(++currentPage)}
            onEndReachedThreshold={0.2}
            ListFooterComponent={loadingMore ? <ListLoaders /> : null}
          />
        )
      )}
    </View>
  ) : (
    <Reload reload={fetchData} />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  mainContainer: {
    margin: 0,
    padding: 0,
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 6,
  },
  titleContainer: {
    margin: 7,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  credentialsContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    alignItems: 'flex-start',
  },
  nameTimestampContainer: {
    flexDirection: 'column',
    flex: 1,
    marginHorizontal: 7,
  },
  name: { color: '#555', fontSize: 17 },
  descriptionContainer: {
    margin: 5,
    overflow: 'hidden',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
