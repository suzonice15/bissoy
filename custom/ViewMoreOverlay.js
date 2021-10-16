import React, { memo } from 'react';
import { Button, Text } from 'native-base';
import { ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
const vm = require('../assets/vm.png');

const ViewMoreOverlay = memo(({ revealContent }) => (
  <ImageBackground source={vm} resizeMode="stretch" style={styles.bg}>
    <Button onPress={revealContent} transparent small style={styles.btn}>
      <Text style={styles.vmText}>View More</Text>
    </Button>
  </ImageBackground>
));

export default ViewMoreOverlay;

const styles = StyleSheet.create({
  bg: {
    width: '100%',
    height: 151,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-end',
    bottom: 0,
  },
  vmText: { color: '#555', fontWeight: 'bold' },
  btn: {
    elevation: 1,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: '#fefefe',
    backgroundColor: '#fff',
  },
});
