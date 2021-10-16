import React from 'react';
import { View, Icon, Text } from 'native-base';
import { dynaSize } from '../../custom/helpers';

export default function FourOhFour() {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
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
          Content Not Found!
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,
        }}>
        <Text
          style={{
            fontSize: dynaSize(14),
            fontWeight: 'bold',
            color: '#cccccc',
            width: '80%',
            textAlign: 'center',
          }}>
          The requested content may have been removed or you don't have access
          to it.
        </Text>
      </View>
    </View>
  );
}
