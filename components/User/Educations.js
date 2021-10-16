import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { H1 } from 'native-base';

export default function Educations({ educations }) {
  return (
    <View style={styles.itemWrapper}>
      <H1 style={{ fontSize: 22, textAlign: 'center' }}>Educations</H1>
      {educations.map((edu, idx) => (
        <View key={edu.education_info_id}>
          {idx !== 0 && <View style={styles.hr} />}
          <Text style={styles.eduPeriod}>
            {edu.education_start_date?.substr(0, 4)} -{' '}
            {edu.currently_studying == 1
              ? 'Present'
              : edu.education_end_year?.substr(0, 4)}
          </Text>
          <Text style={{ fontSize: 18 }}>
            <Text style={styles.degreeTitle}>{edu.degree?.degree_name}</Text>
            &nbsp;on {edu.subject?.subject_name} at{' '}
            {edu.education_institution?.education_institution}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  hr: { height: 1, backgroundColor: '#ddd', marginVertical: 10 },
  degreeTitle: {
    fontWeight: 'bold',
  },
  eduPeriod: { color: '#aaa', fontSize: 14 },
  itemWrapper: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 15,
  },
});
