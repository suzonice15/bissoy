import React from 'react';
import {Footer, FooterTab, Button, Text, Icon} from 'native-base';

export default function ({navigation}) {
  <Footer>
    <FooterTab>
      <Button onPress={() => navigation.openDrawer()}>
        <Icon ios="ios-menu" android="md-menu" />
      </Button>
      <Button active vertical>
        <Icon active type="MaterialCommunityIcons" name="forum-outline" />
        <Text>Forum</Text>
      </Button>
      <Button vertical>
        <Icon type="MaterialCommunityIcons" name="briefcase-plus" />
        <Text>Jobs</Text>
      </Button>
      <Button vertical>
        <Icon type="MaterialCommunityIcons" name="stethoscope" />
        <Text>Doctors</Text>
      </Button>
    </FooterTab>
  </Footer>;
}
