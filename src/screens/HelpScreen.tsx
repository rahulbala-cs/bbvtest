import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS } from '../config/constants';

const HelpScreen: React.FC = () => {
  const githubPagesUrl = 'https://rahulbala94.github.io/biggbossteluguvote/help-faq.html';

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: githubPagesUrl }}
        style={styles.webview}
        startInLoadingState={true}
        scalesPageToFit={true}
        javaScriptEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  webview: {
    flex: 1,
  },
});

export default HelpScreen;