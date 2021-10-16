import React from 'react';
import { View, Text, Icon } from 'native-base';
import { MenuOption } from 'react-native-popup-menu';

export default function ({
  onPress,
  title,
  altTitle,
  iconName,
  altIconName,
  iconType,
  color = '#555',
  activeColor = '#75aaff',
  fontSize = 20,
  disabled = false,
  active = false,
  hide = false,
  divider = false,
}) {
  if (hide) return null;
  return (
    <MenuOption
      onSelect={onPress}
      disabled={disabled}
      customStyles={{
        optionWrapper: {
          borderBottomColor: '#dfdfdf',
          borderBottomWidth: divider ? 1 : 0,
        },
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 4,
        }}>
        {!!iconName && !!iconType && (
          <Icon
            type={iconType}
            name={active ? altIconName || iconName : iconName}
            style={{
              color: active ? activeColor : color,
              fontSize,
              marginRight: 7,
            }}
          />
        )}
        <Text style={{ color: active ? activeColor : color }}>
          {active ? altTitle || title : title}
        </Text>
      </View>
    </MenuOption>
  );
}
