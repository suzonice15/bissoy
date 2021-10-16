import React from 'react';
import { Facebook } from 'react-content-loader/native';
import { StyleSheet, View } from 'react-native';

export default function ListLoaders() {
  return (
    <>
      <Facebook style={styles.m10} />
      <View style={styles.separator} />
      <Facebook style={styles.m10} />
      <View style={styles.separator} />
      <Facebook style={styles.m10} />
      <View style={styles.separator} />
      <Facebook style={styles.m10} />
      <View style={styles.separator} />
      <Facebook style={styles.m10} />
      <View style={styles.separator} />
    </>
  );
}

const styles = StyleSheet.create({
  m10: { margin: 10 },
  separator: { backgroundColor: '#ededed', height: 6 },
});
