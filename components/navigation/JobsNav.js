import React from 'react';
import { View, Text } from 'react-native';
import GlobalHeader from './GlobalHeader';

export default function JobsNav() {
  return (
    <>
      <GlobalHeader />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Jobs</Text>
      </View>
    </>
  );
}
