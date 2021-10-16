import React, { Fragment, useState } from 'react';
import { View, Text, List, ListItem, Thumbnail, Icon } from 'native-base';
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import axios from '../../../axios';
import loc from '../../../localization/loc';
import { useNavigation } from '@react-navigation/native';
const rewardIcons = ['cookie', 'coffee', 'ice-cream', 'hamburger'];
export default function RewardsList({ count, answer_id }) {
  const [rewardLoading, setRewardLoading] = useState(false);
  const [rewards, setRewards] = useState([]);
  const navigation = useNavigation();
  async function loadReward() {
    if (rewards.length > 0) return;
    setRewardLoading(true);
    try {
      const res = await axios.get(`a/${answer_id}/gifts`);
      if (res.status === 200) {
        setRewards(res.data);
      }
      setRewardLoading(false);
    } catch (e) {
      setRewardLoading(false);
    }
  }
  return (
    <View style={styles.rewardContainer}>
      <TouchableOpacity
        style={styles.rewardButton}
        disabled={rewards.length > 0}
        onPress={loadReward}>
        {!rewardLoading ? (
          <>
            <View style={styles.rewardCounter}>
              <Text style={{ color: '#185', fontSize: 18 }}>{count}</Text>
            </View>
            <Text style={styles.rewardText}>
              {loc('rewards.reward', { count })}
            </Text>
          </>
        ) : (
          <ActivityIndicator color="#185" size="large" />
        )}
      </TouchableOpacity>
      {rewards.length > 0 && (
        <List style={styles.rewardList}>
          <ListItem header style={styles.spaceBetween}>
            <Text style={styles.rewardBy}>{loc('rewards.by')}</Text>
            <Text style={styles.dataNumH}>{loc('rewards.gift')}</Text>
            <Text style={styles.dataNumH}>{loc('rewards.bdt')}</Text>
          </ListItem>
          {rewards.map((reward, idx) => (
            <ListItem
              key={idx}
              style={styles.spaceBetween}
              noBorder={idx === rewards.length - 1}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Profile', {
                    screen: 'ProfilePage',
                    params: { user_id: reward.user_id },
                  })
                }
                style={{ flexDirection: 'row', flex: 1 }}>
                <Thumbnail
                  small
                  source={{
                    uri: `https://www.bissoy.com/${
                      reward.dp_62 || 'media/images/default/avatar.jpg'
                    }`,
                  }}
                  style={{ marginRight: 5 }}
                />
                <Text>{reward.username}</Text>
              </TouchableOpacity>
              <View style={styles.rewardGift}>
                <Text style={styles.rewardGiftCount}>{reward.gift_amount}</Text>
                <Icon
                  name={rewardIcons[reward.gift_type - 1]}
                  type="MaterialCommunityIcons"
                  style={{ fontSize: 20 }}
                />
              </View>
              <Text style={styles.rewardTotal}>
                {reward.amount * reward.gift_amount}
              </Text>
            </ListItem>
          ))}
        </List>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  rewardContainer: {
    marginVertical: 10,
    elevation: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderRadius: 10,
  },
  rewardButton: {
    backgroundColor: '#1851',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  spaceBetween: { justifyContent: 'space-between' },
  rewardCounter: {
    borderRadius: 50,
    borderColor: '#185',
    borderWidth: 1,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardText: { color: '#185', marginLeft: 10, fontSize: 18 },
  rewardList: {
    borderWidth: 3,
    borderColor: '#1851',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  dataNumH: {
    fontWeight: 'bold',
    textAlign: 'center',
    width: 80,
  },
  rewardBy: { fontWeight: 'bold', flex: 1 },
  rewardGift: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  rewardGiftCount: { fontSize: 20 },
  rewardTotal: {
    minWidth: 80,
    fontSize: 20,
    textAlign: 'center',
  },
});
