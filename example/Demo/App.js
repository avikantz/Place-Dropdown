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

import Dropdown from './Dropdown';

export default class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			qts: [],
			siz: [] 
		};

		fetch('https://api.myjson.com/bins/u475p').then((resp) => resp.json()).then((json) => {
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
					defaultValue='1'
					showsIndicator={true}
					data={this.state.qty}
					onSelect={(item) => {
						console.log('Selected value: ' + item);
					}}
					style={{ 
						width: 96
					}}
				/>
				<Dropdown
					// showsPlaceholder={true}
					placeholder='Ring Size'
					defaultValue='Select...'
					showsIndicator={true}
					data={this.state.siz}
					onSelect={(item) => {
						console.log('Selected value: ' + item);
					}}
					style={{ 
						width: 96
					}}
					dropdownStyle={{
						shadowOpacity: 0.3,
						shadowRadius: 2,
						shadowOffset: {
							height: 1,
						},
						elevation: 6,
					}}
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
		backgroundColor: '#fcf9ee',
		shadowOpacity: 0.3,
		shadowRadius: 2,
		shadowOffset: {
			height: 1,
		},
		elevation: 4,
	}
});
