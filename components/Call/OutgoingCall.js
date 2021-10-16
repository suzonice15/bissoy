import React from 'react';
import { View, H3, Icon } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function OutgoingCall({ navigation }) {
  return (
    <View style={styles.mainContainer}>
      <Animatable.Image
        animation="pulse"
        easing="ease-in-out"
        iterationCount="infinite"
        style={styles.thumb}
        source={{
          uri: 'https://www.bissoy.com/media/images/default/avatar.jpg',
        }}
      />
      <H3 style={styles.name}>Calling John Doe</H3>

      <View style={styles.receiver}>
        <TouchableOpacity
          onPress={() => navigation.navigate('IncomingCall')}
          style={[styles.button, { backgroundColor: '#f55' }]}>
          <Icon type="Feather" name="phone-off" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#105650',
    paddingVertical: 80,
  },
  thumb: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    marginVertical: 20,
  },
  receiver: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 'auto',
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { color: '#fff', padding: 0, margin: 0 },
  name: {
    fontWeight: 'bold',
    color: '#fff',
  },
});
