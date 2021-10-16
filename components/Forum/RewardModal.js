import React, { useState, useContext, useEffect } from 'react';
import { View, Toast, Text, Button, Icon, Textarea, Input } from 'native-base';
import axios from '../../axios';
import { AuthContext } from '../../contextHandler';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Linking,
} from 'react-native';

const rewards = ['Chocolate', 'Coffee', 'Ice-cream', 'Burger'];
const rewardIcons = ['cookie', 'coffee', 'ice-cream', 'hamburger'];
const amts = [3, 25, 50, 80];

export default function RewardModal({ navigation, route }) {
  const {
    gifted_for,
    gifted_to,
    entity_id,
    question_id,
    toUsername,
  } = route?.params;
  if (!gifted_for || !entity_id) return <Text>ERR::NO_FOR_NO_TO</Text>;
  const { state } = useContext(AuthContext);
  const [header, setHeader] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const [amount, setAmount] = useState(1);
  const [deductBalance, setDeductBalance] = useState(3);
  const [message, setMessage] = useState('');
  const [expiration, setExpiration] = useState('');
  const [anonymous, toggleAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (gifted_for === 'answer') {
      setHeader(
        `If you appreciate ${toUsername}'s answer, please consider supporting what they do. Thank you.`
      );
    } else if (gifted_for === 'blog') {
      setHeader(
        `If you appreciate this blog from ${toUsername}, please consider supporting what they do. Thank you.`
      );
    } else if (gifted_for === 'profile') {
      setHeader(
        `We're assuming <strong>${toUsername}</strong> does great things for our community, support their works with these symbolic gifts.`
      );
    } else if (gifted_for === 'offer') {
      setHeader(
        `Offering gifts for answers ensures quick and detailed response from multiple users. You can optionally add specific instruction.`
      );
    }
  }, [gifted_for]);

  function toggleGift(idx) {
    setActiveIdx(idx);
    setAmount(1);
    setDeductBalance(amts[idx]);
  }

  function incrementAmount() {
    setDeductBalance(amts[activeIdx] * (amount + 1));
    setAmount(amount + 1);
  }
  function decrementAmount() {
    if (amount === 1) return;
    setDeductBalance(amts[activeIdx] * (amount - 1));
    setAmount(amount - 1);
  }

  async function reward() {
    if (state?.user?.balance < deductBalance) {
      Toast.show({
        text: 'Not enough balance!',
        type: 'danger',
        duration: 3000,
      });
      return;
    } else if (gifted_for === 'offer' && expiration < 1) {
      Toast.show({
        text: 'Minimum expiration length is 1 hour!',
        type: 'danger',
        duration: 3000,
      });
      return;
    }
    if (gifted_to === undefined) gifted_to = 0;
    setLoading(true);
    try {
      const res = await axios.post(`gift/give`, {
        gifted_for,
        entity_id,
        gift_type: activeIdx + 1,
        gift_amount: amount,
        message,
        expiration: +expiration,
        anonymous: anonymous ? 1 : 0,
      });
      if (res.status === 200) {
        Toast.show({
          text: 'Gift added!',
          type: 'success',
          duration: 3000,
        });
        navigation.pop();
        navigation.navigate('QuestionDetails', {
          question_id,
        });
      } else {
        Toast.show({
          text: 'Offer Failed! ERR::C2XX',
          type: 'danger',
          duration: 3000,
        });
      }
    } catch (e) {
      Toast.show({
        text: 'Offer Failed! ERR::S5XX',
        type: 'danger',
        duration: 3000,
      });
    }
    setLoading(false);
  }
  function close() {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.closeBtn}>
        <Button small transparent onPress={close}>
          <Icon name="close" style={{ color: '#777' }} />
        </Button>
      </View>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          marginHorizontal: 5,
        }}>
        <Text style={styles.headerText}>{header}</Text>
        <View style={[styles.viewHorizontal]}>
          {rewardIcons.map((r, i) => (
            <Button
              key={r}
              large
              transparent={i !== activeIdx}
              bordered={i === activeIdx}
              style={styles.giftBtn}
              onPress={() => toggleGift(i)}>
              <Icon
                style={{ fontSize: 52, color: '#ff5f5f' }}
                type="MaterialCommunityIcons"
                name={r}
              />
            </Button>
          ))}
        </View>
        <View style={[styles.viewHorizontal, { justifyContent: 'center' }]}>
          <TouchableOpacity
            style={{ backgroundColor: '#fff' }}
            onPress={incrementAmount}>
            <Icon
              style={{ fontSize: 42, color: '#ff5f5f' }}
              type="AntDesign"
              name="pluscircleo"
            />
          </TouchableOpacity>
          <Text style={styles.counter}>{amount}</Text>
          <TouchableOpacity
            style={{ backgroundColor: '#fff' }}
            disabled={amount === 1}
            onPress={decrementAmount}>
            <Icon
              style={{ fontSize: 42, color: '#ff5f5f' }}
              type="AntDesign"
              name="minuscircleo"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.selectedGift}>{rewards[activeIdx]}</Text>

        {(gifted_for === 'profile' || gifted_for === 'offer') && (
          <View style={[styles.viewHorizontal, { justifyContent: 'center' }]}>
            <Textarea
              rowSpan={4}
              style={styles.instruction}
              value={message}
              onChangeText={setMessage}
              placeholder={
                gifted_for === 'profile'
                  ? 'Message (optional, max 160 characters.)'
                  : 'Instruction (optional, max 160 characters.)'
              }
              bordered
              blurOnSubmit
            />
          </View>
        )}
        {gifted_for === 'offer' && (
          <View
            style={[
              styles.viewHorizontal,
              { justifyContent: 'center', marginTop: 0 },
            ]}>
            <View style={styles.expiration}>
              <Input
                keyboardType="numeric"
                placeholder="Expiration (in hour)"
                onChangeText={setExpiration}
              />
            </View>
          </View>
        )}

        <View style={[styles.viewHorizontal, { justifyContent: 'center' }]}>
          <Switch value={anonymous} onValueChange={toggleAnonymous} />
          <Text>Private Gift</Text>
        </View>
        <View style={[styles.viewHorizontal, { justifyContent: 'center' }]}>
          <Button style={styles.mainBtn} onPress={reward}>
            {loading ? (
              <ActivityIndicator color="#fff" size="large" />
            ) : (
              <Text style={{ fontWeight: 'bold', color: '#fff' }}>
                {gifted_for === 'offer' ? 'Offer' : 'Reward'}
              </Text>
            )}
          </Button>
        </View>
        <View style={[styles.viewHorizontal, { justifyContent: 'flex-start' }]}>
          <Text>
            Remaining balance will be{' '}
            <Text style={{ color: '#ff5f5f', fontWeight: 'bold' }}>
              {state?.user?.balance - deductBalance} BDT
            </Text>{' '}
            |{' '}
            <Text
              style={{ color: '#5f5fff', fontWeight: 'bold' }}
              onPress={() =>
                Linking.openURL('https://www.bissoy.com/transactions/recharge')
              }>
              Recharge
            </Text>
          </Text>
        </View>
        <View style={[styles.viewHorizontal, { justifyContent: 'center' }]}>
          <Text note>
            *These are symbolic currency, the equivalent amount of money will be
            deducted from your account and sent to the recipient account.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  closeBtn: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  giftBtn: {
    borderColor: '#ff5f5f',
    backgroundColor: '#fff',
    elevation: 4,
  },
  viewHorizontal: {
    marginVertical: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  selectedGift: {
    textAlign: 'center',
    fontSize: 28,
    color: '#333',
    fontWeight: 'bold',
  },
  counter: {
    marginHorizontal: 15,
    fontSize: 32,
    fontWeight: 'bold',
    minWidth: 62,
    textAlign: 'center',
  },
  expiration: {
    height: 35,
    width: '50%',
    borderBottomWidth: 1,
    borderColor: '#ff5f5f',
  },
  instruction: { width: '90%', padding: 5, borderColor: '#ff5f5f' },
  mainBtn: {
    backgroundColor: '#ff5f5f',
    justifyContent: 'center',
    minWidth: 120,
  },
});
