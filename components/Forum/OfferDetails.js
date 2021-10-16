import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { timesRemaining } from '../../custom/dateFormat';
import { View, Text, Icon } from 'native-base';
import axios from '../../axios';

function Pulsate({ color = '#777' }) {
  const pulse = useRef(new Animated.Value(10)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.spring(pulse, {
        useNativeDriver: false,
        toValue: 200,
        friction: 50,
        tension: 5,
      })
    ).start();
  }, []);

  return (
    <Animated.View
      style={[{ backgroundColor: color, width: pulse }, styles.animView]}
    />
  );
}

const giftIcons = ['cookie', 'coffee', 'ice-cream', 'hamburger'];

export default function OfferDetails({ question_id }) {
  const [offer, setOffer] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchOffer() {
      setLoading(true);
      try {
        const res = await axios.get(`oc/${question_id}`);
        if (res.status === 200) {
          setOffer(res.data.offer);
          setSuccess(res.data.success);
        }
      } catch (e) {
        console.log('OfferDetails Error');
      }
      setLoading(false);
    }
    fetchOffer();
  }, [question_id]);
  if (loading) {
    return (
      <View style={styles.wrapper}>
        <ActivityIndicator color="#333" size="large" />
        <Text style={{ fontSize: 16 }}>Loading Offer...</Text>
      </View>
    );
  }
  if (success) {
    const rt = timesRemaining(offer.expiration);
    return (
      <View style={styles.wrapper}>
        <View style={styles.mainText}>
          <Text
            style={[
              styles.title,
              { color: +offer.accepted ? '#999' : '#333' },
            ]}>
            {offer.username} {rt.past ? 'offered' : 'is offering'}{' '}
            {offer.gift_amount}
          </Text>
          <Icon
            style={{
              marginHorizontal: 3,
              color: +offer.accepted ? '#999' : '#333',
            }}
            name={giftIcons[offer.gift_type - 1]}
            type="MaterialCommunityIcons"
          />
        </View>
        <Text note>
          {(rt.past ? 'Expired ' : 'Expires ') + rt.time}
          {offer.accepted == 0
            ? rt.past
              ? ' but still looking for a good answer.'
              : ', answer for a chance to get selected!'
            : ', an answer was accepted.'}
        </Text>
        {offer.accepted == 0 && (
          <Pulsate color={rt.past ? '#aaa' : 'mediumseagreen'} />
        )}
      </View>
    );
  }
  return null;
}
const styles = StyleSheet.create({
  title: { textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  subtitle: { textAlign: 'center', fontSize: 16, color: '#555' },
  wrapper: {
    backgroundColor: '#fafafa',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: { flexDirection: 'row', alignItems: 'center' },
  animView: {
    height: 3,
    marginVertical: 5,
    borderRadius: 100,
  },
});
