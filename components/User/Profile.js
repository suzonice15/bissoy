import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  Header,
  Left,
  Body,
  Right,
  Title,
  Button,
  Icon,
  Subtitle,
  H1,
  Toast,
  List,
  ListItem,
} from 'native-base';
import axios from '../../axios';
import { AuthContext } from '../../contextHandler';
import ProfileLoader from './ProfileLoader';
import { dynaSize, kilofy } from '../../custom/helpers';
import Timeline from './Timeline';
import loc from '../../localization/loc';
const avatar = require('../../assets/avatar.png');

export default function Profile({ navigation, route }) {
  let user_id = route?.params?.user_id;
  const [data, setData] = useState(null);
  const [isFollowing, toggleFollowing] = useState(false);
  const [tl, toggleTl] = useState(true);
  const [loading, setLoading] = useState(true);
  const {
    state: { user },
  } = useContext(AuthContext);
  if (!user_id) {
    user_id = user?.user_id;
  }
  const fetchProfile = async function () {
    try {
      setLoading(true);
      const res = await axios.get(`profile/${user_id}`);
      if (res.status === 200) {
        if (res.data.length === 1) {
          setData(res.data[0]);
          toggleFollowing(res.data[0].following == 1);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, [user_id]);
  function askToLogin(text = 'Login Required!') {
    if (!user) {
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
  async function follow() {
    if (askToLogin?.()) return;
    const _isFollowing = isFollowing;
    toggleFollowing(!_isFollowing);
    Toast.show({
      text: _isFollowing
        ? `Unfollowed ${data.username}!`
        : `Following ${data.username}!`,
      textStyle: { fontWeight: 'bold' },
      type: _isFollowing ? '' : 'success',
      duration: 2000,
    });
    try {
      const res = await axios.post(`user/${user_id}/follow`);
      if (res.status === 200) return;
      else {
        toggleFollowing(_isFollowing);
        Toast.show({
          text: `Follow failed! ERR::C2XX`,
          type: 'danger',
          duration: 2000,
        });
      }
    } catch (e) {
      toggleFollowing(_isFollowing);
      Toast.show({
        text: `Follow failed! ERR::S5XX`,
        type: 'danger',
        duration: 2000,
      });
    }
  }
  function editProfile() {
    navigation.navigate('ProfileEdit');
  }

  if (loading) {
    return <ProfileLoader />;
  }
  const stats = JSON.parse(data?.stats || '{}');
  return (
    <View style={{ flex: 1 }}>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.openDrawer()}>
            <Icon name="menu" />
          </Button>
        </Left>
        <Body>
          <Title>{data.full_name || data.username || 'Loading...'}</Title>
          <Subtitle>{loc('profile')}</Subtitle>
        </Body>
        <Right />
      </Header>
      <ScrollView
        stickyHeaderIndices={[3]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchProfile} />
        }>
        <View style={styles.middleContainer}>
          <ImageBackground source={avatar} style={styles.profileImage}>
            <Image
              style={styles.profileImage}
              source={{
                uri: `https://www.bissoy.com/${
                  data.dp_300 || data.dp_62 || 'media/images/default/avatar.jpg'
                }`,
              }}
            />
          </ImageBackground>
        </View>
        <View style={[styles.middleContainer, { flexDirection: 'row' }]}>
          {user_id != user?.user_id ? (
            <Button rounded transparent onPress={follow}>
              <Icon
                style={{
                  color: isFollowing ? 'dodgerblue' : 'grey',
                }}
                type="Feather"
                name={`user-${isFollowing ? 'check' : 'plus'}`}
              />
            </Button>
          ) : (
            <TouchableOpacity
              style={styles.textButton}
              onPress={() => navigation.navigate('Follows')}>
              <Icon
                style={{
                  color: '#444',
                }}
                type="Feather"
                name="user"
              />
              <Text style={{ fontSize: 12, color: '#444' }}>Followers</Text>
            </TouchableOpacity>
          )}
          <View style={{ alignItems: 'center', flex: 1 }}>
            <H1 style={{ fontSize: dynaSize(20), fontWeight: 'bold' }}>
              {data.full_name || data.username || 'Loading...'}
            </H1>
            <Text style={{ color: '#888' }}>@{data.username}</Text>
          </View>
          {user_id != user?.user_id ? (
            <Button transparent disabled>
              <Icon type="Feather" name="message-square" />
            </Button>
          ) : (
            <Button icon transparent onPress={editProfile}>
              <Icon
                style={{
                  color: '#444',
                }}
                type="Feather"
                name="edit-2"
              />
            </Button>
          )}
        </View>
        <List
          style={{
            marginVertical: 5,
          }}>
          <ListItem>
            <Left>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                {loc('q_asked')}
              </Text>
            </Left>
            <Right>
              <Text style={{ fontSize: 18 }}>{kilofy(stats.q)}</Text>
            </Right>
          </ListItem>
          <ListItem>
            <Left>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                {loc('q_ans')}
              </Text>
            </Left>
            <Right>
              <Text style={{ fontSize: 18 }}>{kilofy(stats.a)}</Text>
            </Right>
          </ListItem>
          <ListItem>
            <Left>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                {loc('wrote')}
              </Text>
            </Left>
            <Right>
              <Text style={{ fontSize: 18 }}>{kilofy(stats.b)}</Text>
            </Right>
          </ListItem>
          <ListItem>
            <Left>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                {loc('c_total')}
              </Text>
            </Left>
            <Right>
              <Text style={{ fontSize: 18 }}>{kilofy(stats.c)}</Text>
            </Right>
          </ListItem>
          <ListItem>
            <Left>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                {loc('q_view')}
              </Text>
            </Left>
            <Right>
              <Text style={{ fontSize: 18 }}>{kilofy(stats.qv)}</Text>
            </Right>
          </ListItem>
          <ListItem noBorder>
            <Left>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                {loc('a_view')}
              </Text>
            </Left>
            <Right>
              <Text style={{ fontSize: 18 }}>{kilofy(stats.av)}</Text>
            </Right>
          </ListItem>
        </List>
        <View>
          <View style={styles.tlContainer}>
            <Button
              onPress={() => toggleTl(true)}
              style={{
                backgroundColor: tl ? '#efefef' : '#ffffff',
                flex: 1,
                justifyContent: 'center',
              }}>
              <Text style={tl ? styles.tabActive : styles.tabInactive}>
                {loc('recent_post')}
              </Text>
            </Button>
          </View>
        </View>
        <Timeline user_id={data.user_id} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  middleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  profileImage: {
    width: dynaSize(200),
    height: dynaSize(200),
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  actionIcon: { fontSize: 26, color: 'dodgerblue' },
  tlContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  tabInactive: {
    width: '100%',
    textAlign: 'center',
    color: '#333',
    fontSize: 18,
  },
  tabActive: {
    width: '100%',
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
    fontSize: 18,
  },
  textButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
});
