import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  ListItem,
  Text,
  Left,
  Right,
  Body,
  Picker,
  Separator,
} from 'native-base';
import app from '../../app.json';
import i18n from 'i18n-js';
import loc from '../../localization/loc';
import { setLocale } from '../../asyncStorage';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    paddingBottom: 34,
  },
  text: {
    alignSelf: 'center',
    marginBottom: 7,
  },
  mb: {
    marginBottom: 15,
  },
  version: {
    position: 'absolute',
    bottom: 0,
    textAlign: 'center',
    lineHeight: 30,
    backgroundColor: '#dedede',
    padding: 2,
    width: '100%',
    height: 34,
  },
});

const Item = Picker.Item;

export default function Settings({ navigation }) {
  const [lang, setLang] = useState(i18n.currentLocale());
  function onValueChange(value) {
    setLang(value);
    setLocale(value);
    i18n.locale = value;
    Alert.alert(
      loc('loc_alert.title'),
      loc('loc_alert.message'),
      [{ text: loc('loc_alert.btnText'), style: 'cancel' }],
      { cancelable: true }
    );
  }

  return (
    <Container style={styles.container}>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.openDrawer()}>
            <Icon name="menu" />
          </Button>
        </Left>
        <Body>
          <Title>{loc('settings')}</Title>
        </Body>
        <Right />
      </Header>

      <Content>
        <Separator bordered noTopBorder />
        <ListItem icon>
          <Left>
            <Button style={{ backgroundColor: '#007AFF' }}>
              <Icon name="globe" />
            </Button>
          </Left>
          <Body>
            <Text>{loc('lang')}</Text>
          </Body>
          <Right>
            <Picker
              note
              mode="dropdown"
              style={{ width: 120 }}
              selectedValue={lang}
              onValueChange={onValueChange}>
              <Item label={loc('bn')} value="bn" />
              <Item label={loc('en')} value="en" />
            </Picker>
          </Right>
        </ListItem>
      </Content>
      <Text style={styles.version} note>
        {app.name} v{app.version} (beta)
      </Text>
    </Container>
  );
}
