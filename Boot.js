import React, { useState, useContext,useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, StatusBar, View,BackHandler } from 'react-native';
import HomeScreen from './components/HomeScreen';
import ChooseTitle from './components/Forum/Ask/ChooseTitle';
import FinalizeQuestion from './components/Forum/Ask/FinalizeQuestion';
import BlogForm from './components/Forum/Blog/BlogForm';
import LoginScreen from './components/Auth/Login';
import RegisterScreen from './components/Auth/Register';
import DrawerView from './components/navigation/DrawerView';
import { AuthContext } from './contextHandler';
import SplashScreen from './components/Auth/SplashScreen';
import QuestionDetails from './components/Forum/QuestionDetails';
import NotificationList from './components/Notifications/NotificationList';
import Profile from './components/User/Profile';
// import Chat from './components/Chat/Chat';
import FeaturePhoto from './components/Forum/Blog/FeaturePhoto';
import QuestionEdit from './components/Forum/QuestionEdit';
import RewardModal from './components/Forum/RewardModal';
import QuestionExpand from './components/Forum/QuestionExpand';
import WriteAnswer from './components/Forum/Answer/WriteAnswer';
import AnswerEdit from './components/Forum/Answer/AnswerEdit';
import ConnectionError from './components/Auth/ConnectionError';
import FourOhFour from './components/Auth/FourOhFour';
import FAQ from './components/Static/FAQ';
import { navigationRef } from './RootNavigator';
import Settings from './components/Settings/Settings';
import SelectTopic from './components/Forum/Ask/SelectTopic';
import ProfileEdit from './components/User/ProfileEdit';
import TopicNav from './components/navigation/TopicNav';
import Follows from './components/User/Follow/Follows.js';
import { enableScreens } from 'react-native-screens';
import PasswordReset from './components/Auth/PasswordReset';
import IncomingCall from './components/Call/IncomingCall';
import CallPage from './components/Call/CallPage';
import OutgoingCall from './components/Call/OutgoingCall';
import { useNavigation } from '@react-navigation/native';

enableScreens();

const Drawer = createDrawerNavigator();

const Stack = createStackNavigator();


function HomeStack() {
 
   return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="QuestionList" component={HomeScreen} />
      <Stack.Screen name="TopicNav" component={TopicNav} />
      <Stack.Screen name="QuestionExpand" component={QuestionExpand} />
      <Stack.Screen name="QuestionDetails" component={QuestionDetails} />
      <Stack.Screen name="SelectTopic" component={SelectTopic} />
      <Stack.Screen name="QuestionEdit" component={QuestionEdit} />
      <Stack.Screen name="WriteAnswer" component={WriteAnswer} />
      <Stack.Screen name="AnswerEdit" component={AnswerEdit} />
      <Stack.Screen name="RewardModal" component={RewardModal} />
      <Stack.Screen
        name="PasswordReset"
        component={PasswordReset}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="FOF" component={FourOhFour} />
    </Stack.Navigator>
  );
}
function AskStack() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="ChooseTitle" component={ChooseTitle} />
      <Stack.Screen name="FinalizeQuestion" component={FinalizeQuestion} />
      <Stack.Screen name="SelectTopic" component={SelectTopic} />
    </Stack.Navigator>
  );
}
function BlogStack() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="BlogForm" component={BlogForm} />
      <Stack.Screen name="FeaturePhoto" component={FeaturePhoto} />
    </Stack.Navigator>
  );
}
function ProfileStack() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="ProfilePage" component={Profile} />
      <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
      <Stack.Screen name="Follows" component={Follows} />
    </Stack.Navigator>
  );
}
function CallStack() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="IncomingCall" component={IncomingCall} />
      <Stack.Screen name="CallPage" component={CallPage} />
      <Stack.Screen name="OutgoingCall" component={OutgoingCall} />
    </Stack.Navigator>
  );
}

const linking = {
  prefixes: ['bissoy://'],
  config: {
    screens: {
      Notification: 'notif',
      Profile: 'u/:user_id',
      QuestionDetails: 'q/:question_id',
      Chat: 'c/:user_id',
      FOF: '*',
    },
  },
};

export default function Boot() {

 
  const {
    state: { 
      user, 
      isSignedOut,
       isLoading,
        isConnected },
  } = useContext(AuthContext);
  const [isSplashed, setSplashed] = useState(false);

  if (!isConnected) {
    return <ConnectionError />;
  }

  if (isLoading || !isSplashed) {
    return (
      <SplashScreen
        loading={isLoading}
        splashDone={(splashLogo) => {
          splashLogo.tada().then(() => {
            setSplashed(true);
          });
        }}
      />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#16756d',
        paddingTop: StatusBar.currentHeight,
      }}>
      <NavigationContainer
      independent={true}
        ref={navigationRef}
        linking={linking}
        fallback={<ActivityIndicator size="large" color="#16756d" />}>
        <Drawer.Navigator
          initialRouteName={isSignedOut ? 'Login' : 'Home'}
          drawerContent={(props) => <DrawerView {...props} user={user} />}>
          {isSignedOut && (
            <>
              <Drawer.Screen
                name="Login"
                component={LoginScreen}
                options={{ gestureEnabled: false }}
              />
              <Drawer.Screen
                name="Register"
                component={RegisterScreen}
                options={{ gestureEnabled: false }}
              />
            </>
          )}
          <Drawer.Screen name="Home" component={ } />
          <Drawer.Screen name="Notification" component={NotificationList} />
          <Drawer.Screen name="Chat" component={CallStack} />
          <Drawer.Screen name="Ask" component={AskStack} />
          <Drawer.Screen name="Blog" component={BlogStack} />
          <Drawer.Screen name="Profile" component={ProfileStack} />
          <Drawer.Screen name="FAQ" component={FAQ} />
          <Drawer.Screen name="Settings" component={Settings} />
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
  );
}
