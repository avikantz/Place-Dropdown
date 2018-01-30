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

export default class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			data: [] 
		};

		fetch('https://api.myjson.com/bins/xbie5').then((resp) => resp.json()).then((json) => {
			this.setState({
				data: json['numbers']
			});
		}).catch((error) => {
			console.log(error);
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Dropdown
					// showsPlaceholder={true}
					placeholder='Plaaaaaceholder'
					defaultValue='Ring Size'
					showsIndicator={true}
					data={this.state.data}
					onSelect={(item) => {
						console.log('Selected value: ' + item);
					}}
					style={{ 
						width: 144
					}}
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
		backgroundColor: '#f2f2f2',
	}
});
