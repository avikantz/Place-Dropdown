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

const sample_data = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export default class App extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.container}>
				<Dropdown
					showsPlaceholder={true}
					placeholder='Plaaaaaceholder'
					showsIndicator={true}
					data={sample_data}
					onSelect={() => {
						console.log('row pressed');
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
		backgroundColor: '#f2f2f2'
	}
});
