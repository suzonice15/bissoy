import React from 'react';
import ContentLoader, { Rect, Facebook } from 'react-content-loader/native';
import { Text, View } from 'react-native';
// var ReactContentLoaderFacebook = function (props) { return (React.createElement(ContentLoader, __assign({ viewBox: "0 0 476 124", width: 476, height: 124 }, props),
//     React.createElement(Svg.Rect, { x: "48", y: "8", width: "88", height: "6", rx: "3" }),
//     React.createElement(Svg.Rect, { x: "48", y: "26", width: "52", height: "6", rx: "3" }),
//     React.createElement(Svg.Rect, { x: "0", y: "56", width: "410", height: "6", rx: "3" }),
//     React.createElement(Svg.Rect, { x: "0", y: "72", width: "380", height: "6", rx: "3" }),
//     React.createElement(Svg.Rect, { x: "0", y: "88", width: "178", height: "6", rx: "3" }),
//     React.createElement(Svg.Circle, { cx: "20", cy: "20", r: "20" }))); };
export default function ProfileLoader() {
  return (
    <View style={{ alignItems: 'center' }}>
      <ContentLoader
        speed={5}
        width={400}
        height={350}
        viewBox="0 0 400 350"
        backgroundColor="#ededed"
        foregroundColor="#eae9e9">
        <Rect x="125" y="345" rx="2" ry="2" width="140" height="15" />
        <Rect x="105" y="310" rx="2" ry="2" width="180" height="25" />
        <Rect x="75" y="50" rx="2" ry="2" width="240" height="240" />
      </ContentLoader>
      <Text
        style={{
          fontSize: 18,
          color: '#aaa',
          textAlign: 'center',
          marginVertical: 15,
        }}>
        Loading...
      </Text>
      <View style={{ padding: 5 }}>
        <Facebook backgroundColor="#ededed" foregroundColor="#eae9e9" />
        <Facebook backgroundColor="#ededed" foregroundColor="#eae9e9" />
        <Facebook backgroundColor="#ededed" foregroundColor="#eae9e9" />
      </View>
    </View>
  );
}
