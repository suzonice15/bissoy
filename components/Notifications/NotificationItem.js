import React, { memo, useState, useContext } from 'react';
import { Text, View } from 'native-base';
import format from '../../custom/dateFormat';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from '../../axios';
import { AuthContext } from '../../contextHandler';
import NotifContext from '../../custom/NotifContext';
const NotificationItem = memo(
  ({
    notification_id,
    seen = 1,
    title,
    link,
    subtitle,
    created_at,
    handleDelete,
    handleSeen,
  }) => {
    const {
      state: { notifCount },
      authContext: { registerNewNotif },
    } = useContext(AuthContext);
    const [hasSeen, setSeen] = useState(parseInt(seen));
    let toRoute = '#';
    if (link.indexOf('q/') >= 0 || link.indexOf('question/') >= 0) {
      toRoute = link.replace(/.*\D/g, '');
    }
    const navigation = useNavigation();
    function navigateTo() {
      const _notifCount = notifCount;
      setSeen(1);
      registerNewNotif(_notifCount - 1);
      axios.get(`notifications/${notification_id}/seen`).catch((e) => {
        registerNewNotif(_notifCount);
        console.log(e);
      });
      if (toRoute !== '#')
        navigation.navigate('Home', {
          screen: 'QuestionDetails',
          params: { question_id: toRoute },
        });
    }
    function toggleSeen() {
      const _notifCount = notifCount;
      const _hasSeen = hasSeen;
      registerNewNotif(_notifCount + (_hasSeen ? 1 : -1));
      axios
        .get(`notifications/${notification_id}/seen/${hasSeen ? '0' : '1'}`)
        .then(() => {
          setSeen(!_hasSeen);
          handleSeen(notification_id, _hasSeen ? 0 : 1);
        })
        .catch();
    }
    function deleteNotif() {
      const _notifCount = notifCount;
      registerNewNotif(_notifCount - 1);
      axios.get(`notifications/${notification_id}/delete`).catch();
      handleDelete(notification_id);
    }
    return (
      <View
        style={styles.flexOne}
        style={[
          styles.itemContainer,
          { backgroundColor: hasSeen === 0 ? '#f1f1f1' : '#ffffff' },
        ]}>
        <TouchableOpacity activeOpacity={0.7} onPress={navigateTo}>
          <Text
            style={[
              styles.itemTitle,
              { color: hasSeen === 0 ? '#333' : '#999' },
            ]}>
            {title}
          </Text>
          {!!subtitle && (
            <Text
              note
              style={{ color: hasSeen === 0 ? '#666' : '#999' }}
              numberOfLines={1}>
              {subtitle.replace(/(<([^>]+)>)/gi, '')}
            </Text>
          )}
        </TouchableOpacity>
        <View style={styles.ctx}>
          <Text style={styles.date} note>
            {format(created_at)}
          </Text>
          <NotifContext
            notification_id={notification_id}
            seen={hasSeen}
            toggleSeen={toggleSeen}
            deleteNotif={deleteNotif}
          />
        </View>
      </View>
    );
  }
);
export default NotificationItem;
const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  itemContainer: {
    padding: 7,
    borderBottomColor: '#dee0e1',
    borderBottomWidth: 1,
  },
  itemTitle: { fontSize: 16, fontWeight: 'bold' },
  ctx: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  date: { textAlign: 'right', color: '#aaa', marginHorizontal: 10 },
});
