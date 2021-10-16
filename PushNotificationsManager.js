import React from 'react';
import { View } from 'react-native';

export default function PushNotificationsManager({ children }) {
  return <View style={{ flex: 1 }}>{children}</View>;
}
// import React, { useEffect, useRef, useContext } from 'react';
// import { Platform, View, Linking } from 'react-native';
// import { Notifications } from 'react-native-notifications';
// import { AuthContext } from './contextHandler';
// import axios from './axios';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// let shouldUpdateEPT = true;
// export default function PushNotificationsManager({ children }) {
//   Notifications.registerRemoteNotifications();
//   const {
//     state: { user, notifCount },
//     authContext: { registerNewNotif },
//   } = useContext(AuthContext);
//   const notificationListener = useRef();
//   const responseListener = useRef();

//   useEffect(() => {
//     if (!!user) {
//       registerForPushNotificationsAsync();
//     }
//     notificationListener.current = Notifications.addNotificationReceivedListener(
//       () => {
//         registerNewNotif(notifCount + 1);
//       }
//     );
//     responseListener.current = Notifications.addNotificationResponseReceivedListener(
//       (res) => {
//         let url = res?.notification?.request?.content?.data?.url || 'notif';
//         Linking.canOpenURL(`bissoy://${url}`).then((supported) => {
//           if (supported) {
//             Linking.openURL(`bissoy://${url}`).catch();
//           } else {
//             Linking.openURL('bissoy://notif').catch();
//           }
//         });
//       }
//     );

//     return () => {
//       Notifications.removeNotificationSubscription(notificationListener);
//       Notifications.removeNotificationSubscription(responseListener);
//     };
//   }, [user]);

//   return <View style={{ flex: 1 }}>{children}</View>;
// }

// async function registerForPushNotificationsAsync() {
//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;
//   if (existingStatus !== 'granted') {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }
//   if (finalStatus !== 'granted') {
//     alert('Failed to get push token for push notification!');
//     return;
//   }
//   try {
//     if (shouldUpdateEPT) {
//       shouldUpdateEPT = false;
//       let token = (
//         await Notifications.getExpoPushTokenAsync({
//           experienceId: '@sxakil/bissoy',
//         })
//       ).data;
//       console.log(token);
//       await axios.post('push/register', { token });
//     }
//   } catch (e) {
//     shouldUpdateEPT = false;
//     console.log(e);
//   }
//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#16756d',
//     });
//   }
// }
