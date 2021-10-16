import React, { useRef } from 'react';
import { View, H3, Icon } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function IncomingCall({ navigation }) {
  const [terminated, setTerminated] = React.useState(false);

  let anim = useRef(null);

  async function terminate() {
    try {
      setTerminated(true);
      anim.stopAnimation();
    } catch (e) {
      console.log(e.message || e);
    }
  }

  return (
    <View style={styles.mainContainer}>
      <Animatable.Image
        ref={(r) => (anim = r)}
        animation="pulse"
        easing="ease-in-out"
        iterationCount="infinite"
        style={styles.thumb}
        source={{
          uri: 'https://www.bissoy.com/media/images/default/avatar.jpg',
        }}
      />
      <H3 style={styles.name}>{!terminated ? 'John Doe' : 'Terminated'}</H3>

      <View style={styles.receiver}>
        <Animatable.View
          animation="bounce"
          iterationCount="infinite"
          iterationDelay={2000}>
          <TouchableOpacity
            onPress={() => navigation.navigate('OutgoingCall')}
            style={[styles.button, { backgroundColor: '#2a5' }]}>
            <Icon type="Feather" name="phone-call" style={styles.icon} />
          </TouchableOpacity>
        </Animatable.View>
        <TouchableOpacity
          onPress={terminate}
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
