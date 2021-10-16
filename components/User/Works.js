import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { H1 } from 'native-base';

export default function Works({ works }) {
  return (
    <View style={styles.itemWrapper}>
      <H1 style={{ fontSize: 22, textAlign: 'center' }}>Work Experiences</H1>
      {works.map((work, idx) => (
        <View key={work.work_info_id}>
          {idx !== 0 && <View style={styles.hr} />}
          <Text style={styles.workPeriod}>
            {work.work_start_year} -{' '}
            {work.currently_working == 1 ? 'Present' : work.work_end_year}
          </Text>
          <Text style={{ fontSize: 18 }}>
            <Text style={styles.jobTitle}>{work.work_title}</Text>
            &nbsp;at&nbsp;
            <Text style={styles.companyTitle}>{work.work_institution}</Text>
          </Text>
          <Text style={{ fontSize: 16 }}>{work.work_description}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  hr: { height: 1, backgroundColor: '#ddd', marginVertical: 10 },
  jobTitle: {
    fontWeight: 'bold',
  },
  workPeriod: { color: '#aaa', fontSize: 14 },
  itemWrapper: {
    backgroundColor: '#fff',
    padding: 5,
    marginTop: 10,
    borderRadius: 15,
  },
});
