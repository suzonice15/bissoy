import React from 'react';
import { View } from 'react-native';

export default function Radio({ checked }) {
  return (
    <View
      style={{
        height: 24,
        width: 24,
        marginRight: 10,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#16756d',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {checked && (
        <View
          style={{
            height: 12,
            width: 12,
            borderRadius: 6,
            backgroundColor: '#16756d',
          }}
        />
      )}
    </View>
  );
}
