import React from 'react';
import { StyleSheet } from 'react-native';
import { View, H1, Text } from 'native-base';
import dateFormat from '../../custom/dateFormat';
import { kilofy } from '../../custom/helpers';

function Row({ label, value, ln = false }) {
  return (
    <View style={styles.itemContainer}>
      <Text style={{ fontSize: 22, fontWeight: '300' }}>{label}</Text>
      <Text
        style={{
          fontSize: 22,
          fontWeight: '300',
          color: ln ? '#007bff' : '#17a2b8',
        }}>
        {value}
      </Text>
    </View>
  );
}

export default function About({
  points,
  gender,
  birth_year = 2000,
  birth_month = 0,
  birth_date = 1,
  religion,
  marital_status,
  created_at,
  qcount,
  acount,
  bcount,
  ccount,
  aviews,
  qviews,
  followers,
  following,
}) {
  return (
    <>
      <View style={styles.itemWrapper}>
        <H1 style={{ fontSize: 22, textAlign: 'center' }}>Stats</H1>
        <Row label="প্রশ্ন করেছেন" value={qcount + ' টি'} ln />
        <Row label="প্রশ্ন দেখা হয়েছে" value={kilofy(qviews) + ' বার'} />
        <View style={styles.hr} />
        <Row label="উত্তর দিয়েছেন" value={acount + ' টি'} ln />
        <Row label="উত্তর দেখা হয়েছে" value={kilofy(aviews) + ' বার'} />
        <View style={styles.hr} />
        <Row label="ব্লগ লিখেছেন" value={bcount + ' টি'} />
        <Row label="মন্তব্য করেছেন" value={ccount + ' টি'} />
        <Row label="অনুসারী" value={followers + ' জন'} />
        <Row label="অনুসরন করছেন" value={following + ' জন কে'} />
        <Row label="পয়েন্ট" value={points} />
        <View style={styles.hr} />
        <Row
          label="লিঙ্গ"
          value={
            gender === 'm' ? 'Male' : gender === 'f' ? 'Female' : 'Unspecified'
          }
        />
        <Row label="ধর্মীয় বিশ্বাস" value={religion} />
        <Row label="বৈবাহিক অবস্থা" value={marital_status} />
        <Row
          label="জন্মদিন"
          value={dateFormat([birth_year, birth_month - 1, birth_date])}
        />
        <View style={styles.hr} />
        <Row label="সদস্য হয়েছেন" value={dateFormat(created_at)} />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  hr: { height: 1, backgroundColor: '#ddd' },
  itemWrapper: {
    backgroundColor: '#fff',
    padding: 5,
    marginTop: 10,
    borderRadius: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    paddingVertical: 5,
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: '300',
  },
});
