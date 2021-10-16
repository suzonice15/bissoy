import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {
  Header,
  Left,
  Body,
  Right,
  Title,
  Button,
  Icon,
  Subtitle,
  Item,
  Input,
  Label,
  Form,
  Toast,
  Picker,
} from 'native-base';

import { launchImageLibrary } from 'react-native-image-picker';
import axios from '../../axios';
import { AuthContext } from '../../contextHandler';
// import loc from '../../localization/loc';

export default function ProfileEdit({ navigation }) {
  const [dpUri, setDPUri] = useState(null);
  const [dp, setDP] = useState(null);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [gender, setGender] = useState('');
  const [religion, setReligion] = useState('');
  const [relation, setRelation] = useState('');
  const [loading, setLoading] = useState(true);
  const {
    state: { user, token },
  } = useContext(AuthContext);
  useEffect(() => {
    setDPUri({
      uri: `https://www.bissoy.com/${
        user.dp_300 || user.dp_62 || 'media/images/default/avatar.jpg'
      }`,
    });
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await axios.get('user/edit');
        if (res.status === 200) {
          const dt = res.data[0];
          setName(dt.full_name);
          setTagline(dt.tagline);
          setGender(dt.gender);
          setRelation(dt.marital_status_id);
          setReligion(dt.religion_id);
        }
      } catch (e) {
        setName('');
        setTagline('');
        setGender('');
        setReligion('');
        setRelation('');
        Toast.show({
          text: 'Failed to load data! ERR::C2XX',
          type: 'danger',
          duration: 2000,
        });
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  async function chooseDP() {
    try {
      // const {
      //   status,
      // } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      // if (status !== 'granted') {
      //   Alert.alert('Sorry, we need this permissions to make this work!');
      //   return;
      // }
      let response = launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
      });
      if (response.didCancel) {
        Toast.show({
          text: 'Cancelled image upload!',
          duration: 3000,
        });
        return;
      }
      const uri = response.uri;
      setDPUri({ uri });
      setDP(response.base64);
    } catch (e) {
      Toast.show({
        text: 'Cancelled image upload!',
        duration: 3000,
      });
    }
  }
  function onGenderChanged(val) {
    setGender(val);
  }
  function onReligionChanged(val) {
    setReligion(val);
  }
  function onRelationChanged(val) {
    setRelation(val);
  }
  async function editProfile() {
    try {
      setLoading(true);
      const fData = new FormData();
      fData.append('full_name', name);
      fData.append('tagline', tagline);
      fData.append('gender', gender);
      fData.append('religion_id', religion);
      fData.append('marital_status_id', relation);
      if (!!dp) {
        fData.append('dp', dp);
      }
      const res = await fetch('https://www.bissoy.com/api/user/edit', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: fData,
      });
      if (res.status === 200) {
        Toast.show({
          text: 'Changes saved!',
          duration: 2000,
          type: 'success',
        });
        await navigation.pop();
        await navigation.navigate('ProfilePage', {
          user_id: user.user_id || null,
        });
      } else {
        Toast.show({
          text: 'Failed to update! ERR::C2XX',
          duration: 2000,
          type: 'warning',
        });
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      Toast.show({
        text: 'Failed to update! ERR::S5XX',
        duration: 2000,
        type: 'danger',
      });
      setLoading(false);
    }
  }
  function goToWeb() {
    Linking.openURL(`https://www.bissoy.com/${user.username}/update`);
  }
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#16756d" />
        {!!dp && (
          <Text style={{ color: '#16756d', marginTop: 10 }}>Uploading...</Text>
        )}
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.openDrawer()}>
            <Icon name="menu" />
          </Button>
        </Left>
        <Body>
          <Title>{user.full_name || user.username || 'Loading...'}</Title>
          <Subtitle>Edit Profile</Subtitle>
        </Body>
        <Right>
          <Button transparent onPress={() => navigation.goBack()}>
            <Text style={{ color: '#fff' }}>Cancel</Text>
          </Button>
        </Right>
      </Header>
      <ScrollView
        stickyHeaderIndices={[3]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.middleContainer}>
          <TouchableOpacity style={styles.profileImage} onPress={chooseDP}>
            <Image style={styles.profileImage} source={dpUri} />
            <Icon style={styles.dpEditIcon} type="Feather" name="edit-2" />
          </TouchableOpacity>
        </View>
        <Form style={styles.middleContainer}>
          <Item floatingLabel>
            <Label>Full Name</Label>
            <Input value={name || ''} onChangeText={setName} />
          </Item>
          <Item floatingLabel>
            <Label>Signature</Label>
            <Input
              value={tagline || ''}
              onChangeText={setTagline}
              multiline
              maxLength={200}
              style={{ marginTop: 10 }}
            />
          </Item>
          <Item picker style={{ marginLeft: 15 }}>
            <Picker
              mode="dropdown"
              selectedValue={gender}
              onValueChange={onGenderChanged}>
              <Picker.Item label="Male" value="m" />
              <Picker.Item label="Female" value="f" />
              <Picker.Item label="Other" value="o" />
            </Picker>
          </Item>
          <Item picker style={{ marginLeft: 15 }}>
            <Picker selectedValue={religion} onValueChange={onReligionChanged}>
              <Picker.Item label="Islam" value="1" />
              <Picker.Item label="Christianity" value="2" />
              <Picker.Item label="Hinduism" value="3" />
              <Picker.Item label="Buddhism" value="4" />
              <Picker.Item label="Other" value="5" />
            </Picker>
          </Item>
          <Item picker style={{ marginLeft: 15 }}>
            <Picker
              mode="dropdown"
              selectedValue={relation}
              onValueChange={onRelationChanged}>
              <Picker.Item value="1" label="Single" />
              <Picker.Item value="2" label="Engaged" />
              <Picker.Item value="3" label="Married" />
              <Picker.Item value="4" label="Divorced" />
              <Picker.Item value="5" label="Widowed" />
              <Picker.Item value="6" label="Separated" />
              <Picker.Item value="7" label="Domestic Partner" />
              <Picker.Item value="8" label="In a Relationship" />
              <Picker.Item value="9" label="It's Complicated" />
            </Picker>
          </Item>
          <View style={styles.buttons}>
            <Button style={styles.button} onPress={editProfile}>
              <Text style={styles.buttonText}>Save</Text>
            </Button>
            <Button style={styles.button} dark onPress={goToWeb}>
              <Text style={styles.buttonText}>More</Text>
            </Button>
          </View>
        </Form>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  middleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dpEditIcon: {
    position: 'absolute',
    padding: 15,
    borderRadius: 50,
    backgroundColor: '#fff',
    opacity: 0.65,
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  actionIcon: { fontSize: 26, color: 'dodgerblue' },
  tlContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  tabInactive: {
    width: '100%',
    textAlign: 'center',
    color: '#333',
    fontSize: 18,
  },
  tabActive: {
    width: '100%',
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  button: {
    marginVertical: 10,
    width: 100,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
});
