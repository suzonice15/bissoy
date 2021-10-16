import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Icon } from 'native-base';

export default CounterBtn = ({
  type,
  name,
  count = 0,
  highlighted = false,
  highlightColor = 'dodgerblue',
  onPress,
  noCount = false,
}) => (
  <TouchableOpacity
    transparent
    small
    activeOpacity={0.7}
    style={{
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      flexDirection: 'row',
      marginHorizontal: 10,
    }}
    onPress={onPress}>
    <Icon
      style={{
        color: highlighted ? highlightColor : '#888',
        marginHorizontal: 3,
        fontSize: 22,
      }}
      type={type}
      name={name}
    />
    {!noCount && (
      <Text
        style={{
          color: highlighted ? highlightColor : '#888',
          fontSize: 18,
        }}>
        {count}
      </Text>
    )}
  </TouchableOpacity>
);
