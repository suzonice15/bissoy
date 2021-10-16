import React, { memo } from 'react';
import { Icon } from 'native-base';
import { Menu, MenuTrigger, MenuOptions } from 'react-native-popup-menu';
import PopupMenuItem from './PopupMenuItem';
import { Share, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  share: { color: '#888', fontSize: 17, marginHorizontal: 5 },
  grey: { color: '#888' },
});

const AnswerItemContext = memo(
  ({
    answer_id,
    question_id,
    authenticated = false,
    downvoted = false,
    downvote,
    message,
    url,
    simplified = false,
  }) => {
    if (!answer_id) return null;
    const navigation = useNavigation();
    function share() {
      Share.share({
        title: 'Share this answer',
        message:
          message
            ?.replace(/&nbsp;|\/r|\/n|<\/?[^>]+(>|$)/g, '')
            ?.replace(/\s\s+/g, ' ')
            ?.substr(0, 100) +
          '... More at ' +
          url,
        url,
      }).catch((err) => {
        err && console.log(err);
      });
    }
    return (
      <View style={styles.rowCenter}>
        <Menu>
          <MenuTrigger
            children={
              <Icon
                type="MaterialCommunityIcons"
                name="dots-horizontal"
                style={styles.grey}
              />
            }
          />
          <MenuOptions>
            {!simplified && !authenticated && (
              <PopupMenuItem
                onPress={downvote}
                active={downvoted}
                title="Downvote"
                altTitle="Downvoted"
                iconType="MaterialCommunityIcons"
                iconName="arrow-down-circle-outline"
                altIconName="arrow-down-circle"
              />
            )}
            {authenticated && (
              <PopupMenuItem
                onPress={() =>
                  navigation.navigate('AnswerEdit', {
                    answer_id,
                    question_id,
                  })
                }
                title="Edit"
                iconType="MaterialCommunityIcons"
                iconName="circle-edit-outline"
                color="#67f"
              />
            )}
            <PopupMenuItem
              title="Report"
              iconType="MaterialIcons"
              iconName="report"
            />
          </MenuOptions>
        </Menu>
        <TouchableOpacity onPress={share}>
          <Icon type="MaterialIcons" name="share" style={styles.share} />
        </TouchableOpacity>
      </View>
    );
  }
);

export default AnswerItemContext;

/* <PopupMenuItem
  disabled
  onPress={() => requestDelete(answer_id)}
  title="Delete"
  iconType="AntDesign"
  iconName="delete"
  color="#f55"
  divider
/> */
