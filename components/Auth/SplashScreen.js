import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Header } from 'native-base';
import { dynaSize } from '../../custom/helpers';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const logo = require('../../assets/LogoHD.png');
let splashLogo, to;
export default function SplashScreen({ splashDone, loading }) {
  const [minWaitDone, setMinWaitDone] = useState(false);
  const [isFinished, setFinished] = useState(false);

  useEffect(() => {
    to = setTimeout(() => setMinWaitDone(true), 1600);
    splashLogo.bounceIn(1500).then(() => setFinished(true));
    return () => {
      clearTimeout(to);
      setMinWaitDone(false);
      setFinished(false);
    };
  }, []);
  useEffect(() => {
    if (isFinished && !loading && minWaitDone) {
      splashDone(splashLogo);
    }
  }, [isFinished, loading, minWaitDone]);

  return (
    <View style={styles.splashContainer}>
      <Header style={{ display: 'none' }} />
      <View style={styles.imageContainer}>
        <Animatable.Image
          source={logo}
          ref={(r) => (splashLogo = r)}
          useNativeDriver
          style={styles.animatedImage}
        />
      </View>
      <View style={styles.bottomText}>
        <Animatable.Text
          animation="pulse"
          iterationCount="infinite"
          useNativeDriver
          style={styles.brand}>
          Bissoy Answers
        </Animatable.Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    height: '100%',
    width,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#16756d',
    position: 'absolute',
  },
  animatedImage: {
    marginLeft: dynaSize(20),
    width: dynaSize(120.2 * 1.5),
    height: dynaSize(210 * 1.5),
  },
  imageContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottomText: { width: '100%', padding: dynaSize(40) },
  brand: {
    width: '100%',
    textAlign: 'center',
    color: '#fafafa',
    fontSize: dynaSize(26),
    fontWeight: 'bold',
    borderRadius: 10,
  },
});
