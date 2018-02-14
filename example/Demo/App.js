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
  AppRegistry,
} from 'react-native';

import Dropdown from 'place-dropdown';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      qts: [],
      siz: [] 
    };

    fetch('https://api.myjson.com/bins/mpuf9').then((resp) => resp.json()).then((json) => {
      this.setState({
        qts: json['quantity'],
        siz: json['ringSizes']
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Dropdown
          showsPlaceholder={true}
          placeholder='Quantity'
          defaultValue=' '
          showsIndicator={true}
          data={this.state.qts}
          onSelect={(item) => {
            console.log('Selected value: ' + item);
          }}
          style={{ 
            width: 96
          }}
        />
        <Dropdown
          showsPlaceholder={false}
          placeholder='Ring Size'
          defaultValue={'1'}
          defaultIndex={0}
          showsIndicator={true}
          data={Array(10).fill().map((e, i) => (i + 1).toString())}
          onSelect={(item, index) => {
            console.log('Selected value: ' + item + ', at index: ' + index);
          }}
          style={styles.dropdownContainer}
        />
      </View>
    );
  }
}

AppRegistry.registerComponent('Demo', () => App);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 64,
    marginHorizontal: 12,
    padding: 32,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
    },
    elevation: 4,
  },
  dropdownContainer: {
    width: 60,
    height: 24,
    borderColor: '#959595',
    alignItems: 'center',
},
});
