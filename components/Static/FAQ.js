import React, { useState } from 'react';
import { View, Button, Icon, H3, Text, List, ListItem } from 'native-base';
import { StyleSheet, ScrollView } from 'react-native';
import Radio from '../../custom/Radio';
const B = ({ children }) => (
  <Text style={{ fontWeight: 'bold' }}>{children}</Text>
);
const I = ({ children }) => (
  <Text style={{ fontStyle: 'italic' }}>{children}</Text>
);
const dataArray = [
  {
    title: 'বিস্ময়ে কিভাবে রেজিস্ট্রেশন করবো?',
    content: (
      <Text>
        রেজিস্ট্রেশন করতে নেভিগেশন-বার এ <B>Sign Up</B> বাটনে ক্লিক করুন, তারপর
        নিম্নোক্ত নির্দেশনা অনুযায়ী প্রত্যেকটি ফিল্ড পূরণ করুন— {'\n\n'}
        <B>Username</B> - ইউজারনেম অবশ্যই ইউনিক হতে হবে, সাধারনত নিজের ডাকনামের
        সাথে কিছু সংখ্যা যুক্ত করেই বেশিরভাগ ইউজারনেম দেয়া হয়ে থাকে। মনে রাখবেন,
        ইউজারনেম কমপক্ষে ৪ অক্ষরের হতে হবে এবং এতে কোনরকম সাংকেতিক চিহ্ন বা
        বিরামচিহ্ন ব্যবহার করা যাবেনা। {'\n\n'}
        <B>Email</B> - ইমেইল ফিল্ড-এ আপনার একটি একটিভ ইমেইল ঠিকানা দিন, এই ইমেইল
        এড্রেসে রেজিষ্ট্রেশনের পর একটি ভেরিফিকেশন লিঙ্ক পাঠানো হবে।{'\n\n'}
        <B>Password</B> - পাসওয়ার্ড ফিল্ড-এ মনে রাখার মতো কিন্তু কমপ্লেক্স একটি
        পাসওয়ার্ড প্রবেশ করান। পাসওয়ার্ড অবশ্যই কমপক্ষে ৬ সংখ্যার হতে হবে।
        {'\n\n'}
        <B>Confirm Password</B>- কনফার্ম পাসওয়ার্ড ফিল্ড-এ পুনরায় আপনার প্রদত্ত
        পাসওয়ার্ডটি দিন। Password এবং Confirm Password ফিল্ড এ দেয়া ইনপুট অনুরূপ
        হওয়া বাধ্যতামূলক।{'\n\n'}
        <B>Birthdate</B> - এখানে যথাক্রমে আপনার জন্মমাস, দিন এবং বছর প্রবেশ
        করান।{'\n\n'}
        <B>Gender</B> - আপনার লিঙ্গ সিলেক্ট করুন।{'\n\n'}
        <B>Accept T&C</B> - বিস্ময় ব্যবহার করতে হলে আপনাকে অবশ্যই এর নীতিমালা
        মেনে চলতে হবে, এই অঙ্গীকার প্রদান করতে এই অপশনটিতে টিক দিন।{'\n\n'}
        এবার <B>Sign Up</B> বাটনে ক্লিক করে আপনার রেজিস্ট্রেশন সম্পন্ন করুন।
        আপনার দেয়া ইউজারনেম বা ইমেইল ব্যবহার করে ইতোমধ্যে কোনো একাউন্ট খোলা হয়ে
        থাকলে আপনাকে একটি সতর্কতা প্রদান করা হবে, সেক্ষেত্রে ভিন্ন
        ইউজারনেম/ইমেইল দিয়ে পুনরায় চেষ্টা করুন।{'\n\n'}
        <I>
          রেজিষ্ট্রেশন সম্পন্ন হলে আপনার ইমেইল ইনবক্স (ইনবক্সে না পেলে
          স্পামবক্স) চেক করুন, বিস্ময় থেকে পাঠানো ভেরিফিকেশন লিঙ্কে ক্লিক করে
          একাউন্ট ভেরিফাই করুন।
        </I>
      </Text>
    ),
  },
  // {
  //   title: 'কিভাবে প্রশ্ন করতে হয়?',
  //   content: (
  //     <Text>
  //         প্রশ্ন করতে যেকোন প্রশ্নোত্তর পেজ এর উপরে <B>প্রশ্ন করুন</B> বাটনে ক্লিক করুন। পরবর্তি পেজে প্রশ্ন করার ফর্ম দেখতে পাবেন।</p>
  //               <p class="m-0">প্রথম ফিল্ডে প্রশ্নের শিরোনামটি লিখুন, শিরোনাম অবশ্যই প্রশ্নবোধক চিহ্ন (?) দিয়ে শেষ করুন। মনে রাখবেন, শিরোনাম প্রশ্নবোধক না হয়ে অনুরোধমূলক হলে
  //               মডারেটরগন প্রশ্নটি বাতিল করে দিতে পারেন।<p>
  //               <p class="m-0">শিরোনাম লেখার সময় ইতোমধ্যেই অনুরূপ প্রশ্ন আছে কিনা তা চেক করে দেখানো হবে, যদি প্রশ্নটি আগেই করা হয়ে থাকে তাহলে পুনরায় প্রশ্ন না করে
  //               উক্ত প্রশ্নে ক্লিক করে আপনার প্রয়োজনীয় উত্তর দেখে নিন।</p>
  //               <p>"বিস্তারিত" ফিল্ড-এ আপনার প্রশ্নের ব্যাখ্যামূলক তথ্য (যদি থাকে) তা লিখতে পারেন, এটি আবশ্যক নয়।</p>
  //               <p>পরবর্তি অপশনে আপনার প্রশ্নের সাথে সাদৃশ্যপূর্ণ একটি বিভাগ সিলেক্ট করুন। কোনো সম্পর্কিত বিভাগ খুজে না পেলে নতুন বিভাগ ক্রিয়েট করার অপশন
  //               দেখবেন, তাতে ক্লিক করে একটি বিভাগ ক্রিয়েট করে নিন। প্রতিটি প্রশ্নে অন্তত একটি বিভাগ থাকা বাধ্যতামুলক</p>
  //               <p>পরিচয় গোপন করার অপশনটি সিলেক্ট করলে প্রশ্নে আপনার নাম প্রদর্শিত হবেনা, তবে মডারেটর বা এডমিনিস্ট্রেটর বিশেষ প্রয়োজনে আপনার পরিচয় দেখতে পারবেন।</p>
  //               <p>এবার Add Question বাটনে ক্লিক করুন, সব ঠিকঠাক থাকলে কয়েক সেকেন্ডের মধ্যেই অটোমেটিক আপনাকে জিজ্ঞাসিত প্রশ্নের পেজে রিডাইরেক্ট করা হবে।</p>
  //               <p><small style="color: red">প্রশ্নে কোন অশালীন শব্দ কিংবা কোনো লিঙ্ক থাকলে সেটি সাথে সাথে অনুমোদিত না হয়ে মডারেটরের অনুমোদনের জন্য অপেক্ষারত থাকবে।</small></p>
  //               </div>
  //           </div>
  //       </Text>
  //   ),
  // },
  { title: 'কিভাবে ব্লগ লিখতে হয়?', content: 'Lorem ipsum dolor sit amet' },
  { title: 'কিভাবে উত্তর দিতে হয়?', content: 'Lorem ipsum dolor sit amet' },
  { title: 'কিভাবে রিপোর্ট করতে হয়?', content: 'Lorem ipsum dolor sit amet' },
  {
    title: 'অফার কি? এবং কিভাবে কাজ করে?',
    content: 'Lorem ipsum dolor sit amet',
  },
  { title: 'কিভাবে রিচার্জ করবো?', content: 'Lorem ipsum dolor sit amet' },
  { title: 'কিভাবে টাকা উত্তোলন করবো?', content: 'Lorem ipsum dolor sit amet' },
];
export default function FAQ({ navigation }) {
  const [expand, setExpand] = useState(null);
  const [opened, setOpened] = useState(false);
  function toggler(idx) {
    setOpened(!opened);
    setExpand(idx);
  }
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Button transparent large onPress={() => navigation.openDrawer()}>
          <Icon name="menu" style={styles.menu} />
        </Button>
        <H3 style={styles.headerText}>Help</H3>
      </View>
      <List>
        {dataArray.map((data, idx) => (
          <React.Fragment key={idx}>
            <ListItem onPress={() => toggler(idx)}>
              <Radio checked={expand === idx && opened} />
              <Text>{data.title}</Text>
            </ListItem>
            <ListItem
              style={{ display: expand === idx && opened ? 'flex' : 'none' }}>
              <Text>{data.content}</Text>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16756d',
    height: 60,
    elevation: 5,
  },
  headerText: {
    fontWeight: 'bold',
    margin: 10,
    color: '#fefefe',
  },
  menu: {
    color: '#fefefe',
    fontSize: 26,
  },
});
