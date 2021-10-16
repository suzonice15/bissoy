import React, { useRef } from 'react';
import {
  View,
  UIManager,
  findNodeHandle,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'native-base';

function Popupmenu({ actions, onPress }) {
  let menu = useRef();
  function handleShowPopupError() {
    throw new Error('Failed to open popup menu!');
  }

  function handleMenuPress() {
    UIManager.showPopupMenu(
      findNodeHandle(menu),
      actions,
      handleShowPopupError,
      onPress,
    );
  }

  return (
    <View>
      <TouchableOpacity onPress={handleMenuPress}>
        <Icon
          ref={(r) => (menu = r)}
          type="MaterialCommunityIcons"
          name="dots-horizontal"
          style={{ color: '#888' }}
        />
      </TouchableOpacity>
    </View>
  );
}

export default Popupmenu;
