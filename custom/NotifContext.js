import React, { memo } from 'react';
import { Icon } from 'native-base';
import { Menu, MenuTrigger, MenuOptions } from 'react-native-popup-menu';
import PopupMenuItem from './PopupMenuItem';
import { TouchableOpacity } from 'react-native';

const NotifContext = memo(
  ({ notification_id, seen, toggleSeen, deleteNotif }) => {
    if (!notification_id) return null;
    return (
      <Menu>
        <MenuTrigger
          customStyles={{
            TriggerTouchableComponent: TouchableOpacity,
          }}
          children={
            <Icon
              type="Feather"
              name="more-horizontal"
              style={{ color: '#aaa' }}
            />
          }
        />
        <MenuOptions>
          <PopupMenuItem
            onPress={toggleSeen}
            title={`Mark as ${seen ? 'unread' : 'read'}`}
            iconType="Feather"
            iconName="eye"
            altIconName="eye-off"
            active={seen}
            activeColor="#333"
          />
          <PopupMenuItem
            onPress={deleteNotif}
            title="Delete"
            iconType="AntDesign"
            iconName="delete"
            color="#f55"
            divider
          />
        </MenuOptions>
      </Menu>
    );
  },
);
export default NotifContext;
