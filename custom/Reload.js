import React from 'react';
import { View, Icon, Text, Button } from 'native-base';
import { dynaSize } from './helpers';

export default function Reload({ reload }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <Icon
          style={{ fontSize: dynaSize(72), color: '#cecece' }}
          type="Feather"
          name="cloud-off"
        />
        <Text
          style={{
            fontSize: dynaSize(24),
            fontWeight: 'bold',
            color: '#cdcdcd',
            marginBottom: 15,
          }}>
          Failed to Load
        </Text>
      </View>
      <Button
        style={{ marginTop: 10 }}
        rounded
        iconLeft
        danger
        onPress={reload}>
        <Icon type="MaterialCommunityIcons" name="reload" />
        <Text>Refresh</Text>
      </Button>
    </View>
  );
}
