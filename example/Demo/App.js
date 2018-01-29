/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import Dropdown from './Dropdown';

const sample_data = ['1', '2', '3', '4', '5', '6'];

export default class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Dropdown
          style={{
            width: 100,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: '#959595',
          }}
          showsPlaceholder={true}
          placeholder={'Does this work?'}
          data={sample_data}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
    padding: 32,
    backgroundColor: '#f2f2f2'
  }
});
