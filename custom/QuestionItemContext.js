import React, { memo, useState } from 'react';
import { Icon, View } from 'native-base';
import { Menu, MenuTrigger, MenuOptions } from 'react-native-popup-menu';
import PopupMenuItem from './PopupMenuItem';
import { useNavigation } from '@react-navigation/native';
import { Share, StyleSheet, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  share: { color: '#888', fontSize: 17, marginHorizontal: 5 },
  grey: { color: '#888' },
});

const QuestionItemContext = memo(
  ({
    question_id,
    toggleBookmark,
    isBookmarked,
    authenticated,
    simplified = false,
    url,
    message,
  }) => {
    if (!question_id) return null;
    const [bookmarked, setBookmarked] = useState(isBookmarked);
    const navigation = useNavigation();
    function share() {
      Share.share({
        title: 'Share this question',
        message: message + ' Visit ' + url + ' to see the answers.',
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
            <PopupMenuItem
              onPress={() => {
                setBookmarked(!bookmarked);
                toggleBookmark();
              }}
              title="Bookmark"
              altTitle="Bookmarked"
              iconType="AntDesign"
              iconName="pushpino"
              altIconName="pushpin"
              active={bookmarked}
            />
            {authenticated && (
              <PopupMenuItem
                onPress={() =>
                  navigation.navigate('QuestionEdit', { question_id })
                }
                title="Edit"
                iconType="MaterialCommunityIcons"
                iconName="circle-edit-outline"
                color="#67f"
              />
            )}
            {!simplified && (
              <PopupMenuItem
                title="Report"
                iconType="MaterialIcons"
                iconName="report"
              />
            )}
          </MenuOptions>
        </Menu>
        <TouchableOpacity onPress={share}>
          <Icon type="MaterialIcons" name="share" style={styles.share} />
        </TouchableOpacity>
      </View>
    );
  }
);

export default QuestionItemContext;

/*
<PopupMenuItem
  title="Delete"
  iconType="AntDesign"
  iconName="delete"
  color="#f55"
  disabled={true}
  divider
/> */
