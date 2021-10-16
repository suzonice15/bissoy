import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { H1, Badge } from 'native-base';

export default function Skills({ skills }) {
  return (
    <View style={styles.itemWrapper}>
      <H1 style={styles.skillHeader}>Skills</H1>
      <View style={styles.skillContainer}>
        {skills.map((skill) => (
          <Badge info key={skill.skill_id} style={styles.skillItem}>
            <Text style={styles.skillText}>{skill.skill.skill_name}</Text>
          </Badge>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skillItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 2,
  },
  skillHeader: { fontSize: 22, textAlign: 'center' },
  skillText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  skillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  itemWrapper: {
    backgroundColor: '#fff',
    padding: 5,
    marginTop: 10,
    borderRadius: 15,
  },
});
