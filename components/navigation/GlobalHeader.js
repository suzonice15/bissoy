import React, { useState, useRef, useEffect, useContext } from 'react';
import * as Animatable from 'react-native-animatable';
import { Text, Header, Icon, View, Button } from 'native-base';
import QuestionSearch from '../Forum/QuestionSearch';
import {
  TextInput,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  BackHandler, Alert
} from 'react-native';
import { dynaSize } from '../../custom/helpers';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contextHandler';
import loc from '../../localization/loc';

const AnimatedNavigationBar = Animated.createAnimatedComponent(Header);

function AnimateIn({ setSearchActive, title, setTitle }) {
  let sBar = useRef(null);

  useEffect(() => {
    animateIn();
    return () => setTitle('');
  }, []);
  function animateIn() {
    sBar?.fadeInRight();
  }
  function animateOut() {
    sBar?.fadeOutRightBig().then(() => setSearchActive(false));
  }
  return (
    <Animatable.View
      duration={300}
      useNativeDriver
      ref={(r) => (sBar = r)}
      style={styles.container}>
      <View style={styles.searchContainer}>
        <Button transparent rounded>
          <Icon name="search" style={styles.primaryText} />
        </Button>
        <TextInput
          placeholder={loc('search_ph')}
          placeholderTextColor="#aaa"
          value={title}
          onChangeText={setTitle}
          style={styles.searchBox}
          autoFocus
          blurOnSubmit
        />
        <Button transparent rounded onPress={animateOut}>
          <Icon name="close-circle-outline" style={styles.primaryText} />
        </Button>
      </View>
    </Animatable.View>
  );
}

const height = new Animated.Value(60);
export default function GlobalHeader({ hideNavBar}) {
  const [searchActive, setSearchActive] = useState(false);
  const [title, setTitle] = useState('');
  const navigation = useNavigation();
  const {
    state: { 
      notifCount = 0,
       msgCount = 0 
      },
  } = useContext(AuthContext);


  /*     for back handler     */
  

  useEffect(() => {
    Animated.timing(height, {
      duration: 200,
      useNativeDriver: false,
      toValue: hideNavBar ? 0 : 60,
    }).start();
  }, [hideNavBar]);
  const alertCount = notifCount + msgCount;
  return (
    <>
      <AnimatedNavigationBar searchBar span style={[styles.main, { height }]}>
        <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
          <View style={styles.brandBtn}>
            {alertCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifText}>{alertCount}</Text>
              </View>
            )}
            <Icon style={styles.hamIcon} name="menu" />
            <Text style={styles.brand}>
              Bissoy{!searchActive ? ' Answers' : ''}
            </Text>
          </View>
        </TouchableWithoutFeedback>

        {searchActive ? (
          <AnimateIn
            setSearchActive={setSearchActive}
            title={title}
            setTitle={setTitle}
          />
        ) : (
          <View style={styles.searchBtn}>
            <Button
              rounded
              transparent
              small
              onPress={() => {
                setSearchActive(true);
              }}>
              <Icon name="search" style={styles.btnIcon} />
            </Button>
          </View>
        )}
      </AnimatedNavigationBar>
      {searchActive && <QuestionSearch title={title} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginVertical: 10, opacity: 0 },
  primaryText: { color: '#16756d' },
  main: { alignItems: 'center', elevation: 0 },
  hamIcon: { color: '#fafafa', marginRight: 10 },
  notifBadge: {
    backgroundColor: '#fafafa',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderRadius: 10,
    minWidth: 18,
    maxWidth: 30,
    height: 18,
    zIndex: 10,
    top: 0,
    left: -4,
  },
  notifText: {
    color: '#16756d',
    fontSize: 12,
    fontWeight: 'bold',
  },
  brandBtn: {
    flexDirection: 'row',
    marginRight: 10,
    alignItems: 'center',
  },
  brand: {
    color: '#fff',
    fontSize: dynaSize(25),
    fontWeight: 'bold',
  },
  searchBox: {
    flex: 1,
    fontSize: 15,
  },
  searchBtn: {
    flex: 1,
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  btnIcon: { color: '#fafafa', fontSize: dynaSize(24) },
  searchContainer: {
    flex: 1,
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
  },
});
