/**
 * Created by avikantz on 1/24/18
 */

'use strict';

import React, { Component, } from 'react';

import {
	StyleSheet,
	Dimensions,
	View,
	Text,
	FlatList,
	TouchableWithoutFeedback,
	TouchableHighlight,
	Modal,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	Platform,
	StatusBar,
} from 'react-native';

import PropTypes from 'prop-types';

import styles from './Styles';

export default class Dropdown extends Component {

	static propTypes = {
		defaultIndex: PropTypes.number,			// -1 initially
		defaultValue: PropTypes.string,			

		placeholder: PropTypes.string,
		showsPlaceholder: PropTypes.bool,

		indicatorImageUri: PropTypes.string,
		showsIndicator: PropTypes.bool,

		itemsShown: PropTypes.number,			// Number of items shown by the dropdown, minimum of this value and number of items in data; initially 5

		style: PropTypes.object, 				// Container style
		placeholderStyle: PropTypes.object, 	// Placeholder text
		textStyle: PropTypes.object, 			// Row text
		indicatorStyle: PropTypes.object, 		// Indicator
		rowStyle: PropTypes.object, 			// Dropdown rows
		dropdownStyle: PropTypes.object, 		// Dropdown container
		modalStyle: PropTypes.object, 			// Modal dropdown

		data: PropTypes.array,					// Array of items to display

		onSelect: PropTypes.func				// Callback; returns 'item' and 'index'
	};

	static defaultProps = {
		defaultIndex: -1,
		defaultValue: ' ',

		placeholder: 'Select',
		showsPlaceholder: false,

		itemsShown: 5,

		indicatorImageUri: 'https://i.imgur.com/RVuQJh0.png',
		showsIndicator: true,

		data: []
	};

	constructor(props) {
		super(props);

		this._viewRef = null;
		this._viewRefFrame = null;
		this._nextIndex = null;
		this._nextValue = null;

		this.state = {
			selectedIndex: props.defaultIndex,
			selectedValue: props.showsPlaceholder ? ' ' : props.defaultValue,
			showDropdown: false,
			loading: props.data === null || props.data === undefined,
			placeholderTransfromValue: props.defaultIndex === -1 ? 1 : 0,
		};
	}

	componentWillReceiveProps(newProps) {
		let selectedValue = this._nextValue === null ? this.state.selectedValue : this._nextValue.toString();
		let selectedIndex = this._nextIndex === null ? this.state.selectedIndex : this._nextIndex;
		if (selectedIndex < 0) {
			selectedIndex = newProps.defaultIndex;
			if (selectedIndex < 0) {
				selectedValue = newProps.showsPlaceholder ? ' ' : newProps.defaultValue;
			}
		}
		selectedIndex = newProps.selectedIndex ? newProps.selectedIndex : selectedIndex
		selectedValue = newProps.selectedValue ? newProps.selectedValue : selectedValue
		this._nextValue = null;
		this._nextIndex = null;

		if (selectedIndex === -1) {
			this.animatePlaceholderToValue(1);
		} else {
			this.animatePlaceholderToValue(0);
		}

		this.setState({
			loading: newProps.data == null,
			selectedIndex: selectedIndex,
			selectedValue: selectedValue,
		});
	}

	animatePlaceholderToValue(value) {
		if (this.state.selectedIndex > -1) {
			this.setState({placeholderTransfromValue: 0});
			return;
		}
		if (Math.abs(this.state.placeholderTransfromValue - value) <= 0.01) { 
			this.setState({placeholderTransfromValue: value});
			return;
		}
		setTimeout(() => {
			this.setState({ placeholderTransfromValue: this.state.placeholderTransfromValue + (value === 0 ? -1/15 : 1/15) })
			this.animatePlaceholderToValue(value);
		}, 1/2000);
	}

	render() {
		return (
			<View {...this.props}>
				{this._renderButton()}
				{this._renderModal()}
			</View>
		)
	}

	_updatePosition(callback) {
		if (this._viewRef && this._viewRef.measure) {
			this._viewRef.measure((fx, fy, width, height, px, py) => {
				this._viewRefFrame = { x: px, y: py, w: width, h: height };
				callback && callback();
			});
		}
	}

	show() {
		if (!this.state.selectedIndex || this.state.selectedIndex === -1) {
			this.animatePlaceholderToValue(0);
		}
		this._updatePosition(() => {
			this.setState({
				showDropdown: true
			});
		});
	}

	hide() {
		if (!this.state.selectedIndex || this.state.selectedIndex === -1) {
			this.animatePlaceholderToValue(1);
		}
		this.setState({
			showDropdown: false
		});
	}

	select(idx) {
		let value = this.props.defaultValue;
		if (idx === null || (this.props.data == null && idx >= this.props.data.length)) {
			idx = this.props.defaultIndex;
		}

		if (idx >= 0) {
			value = this.props.data[idx].toString();
		}

		this._nextValue = value;
		this._nextIndex = idx;

		this.setState({
			selectedValue: value,
			selectedIndex: idx
		});
	}

	_renderButton() {
		var placeStyle = this.props.showsPlaceholder ? { textAlign: 'left' } : {};
		return (
			<TouchableWithoutFeedback
				onPress={() => {
					this.show();
				}}
			>
				<View style={[styles.container, this.props.style]} ref={v => this._viewRef = v}>
					<View style={styles.textContainer}>
						{this._renderPlaceholder()}
						<Text style={[styles.textStyle, placeStyle, this.props.textStyle]} numberOfLines={1}>
							{this.state.selectedValue}
						</Text>
					</View>
					{this._renderIndicator()}
				</View>
			</TouchableWithoutFeedback>
		)
	}

	_renderIndicator() {
		if (this.props.showsIndicator) {
			return (
				<Image source={{ uri: this.props.indicatorImageUri }} style={[styles.indicator, this.props.indicatorStyle]} />
			)
		}
	}

	_renderPlaceholder() {
		if (this.props.showsPlaceholder) {
			var placeStyle = (!this.state.selectedIndex || this.state.selectedIndex == -1) ? { transform: [ { translateY: parseInt(9.0 * this.state.placeholderTransfromValue) }, { translateX: parseInt(8.0 * this.state.placeholderTransfromValue) }, { scaleX: Math.max(this.state.placeholderTransfromValue * 4/3, 1) }, { scaleY: Math.max(this.state.placeholderTransfromValue * 4/3, 1) } ] } : {};
			return (
				<View style={[styles.placeholderContainer, placeStyle]}>
					<Text style={[styles.placeholderText, this.props.placeholderStyle]}>
						{this.props.placeholder}
					</Text>
				</View>
			)
		}
	}

	_renderModal() {
		if (this.state.showDropdown && this._viewRefFrame) {
			const frameStyle = this._calcPosition();
			return (
				<Modal animationType='fade'
					visible={true}
					transparent={true}
					onRequestClose={() => {
						this.hide();
					}}
					supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}>
					<TouchableWithoutFeedback
						disabled={!this.state.showDropdown}
						onPress={() => {
							this.hide();
						}}>
						<View style={[styles.modal, this.props.modalStyle]}>
							<View style={[styles.dropdown, this.props.dropdownStyle, frameStyle]}>
								{this.state.loading ? this._renderLoading() : this._renderDropdown()}
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			);
		}
	}

	_calcPosition() {
		const dimensions = Dimensions.get('window');
		const windowWidth = dimensions.width;
		const windowHeight = dimensions.height;

		const dropdownHeight = (32 + StyleSheet.hairlineWidth) * Math.min(5, this.props.data ? this.props.data.length : 5);

		const bottomSpace = windowHeight - this._viewRefFrame.y - this._viewRefFrame.h;
		const rightSpace = windowWidth - this._viewRefFrame.x;
		const showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= this._viewRefFrame.y;
		const showInLeft = rightSpace >= this._viewRefFrame.x;

		let style = {
			height: dropdownHeight,
			top: (showInBottom ? this._viewRefFrame.y + this._viewRefFrame.h : Math.max(0, this._viewRefFrame.y - dropdownHeight)) - (Platform.OS === "android" ? StatusBar.currentHeight : 0),
		};

		if (showInLeft) {
			style.left = this._viewRefFrame.x;
		} else {
			style.right = rightSpace - this._viewRefFrame.w;
		}

		if (this.props.adjustFrame) {
			style = this.props.adjustFrame(style) || style;
		}

		style.width = this._viewRefFrame.w;
		return style;
	}

	_renderLoading() {
		return (
			<ActivityIndicator size='small' />
		);
	}

	_renderDropdown() {
		return (
			<FlatList
				scrollEnabled={true}
				style={styles.list}
				data={this.props.data}
				renderItem={({ item, index }) => (
					<TouchableHighlight
						highlighted={(index == this.state.selectedIndex)}
						onPress={() => {
							const { onSelect } = this.props;
							if (!onSelect || onSelect(item, index) !== false) {
								this._nextValue = item;
								this._nextIndex = index;
								this.setState({
									selectedValue: item.toString(),
									selectedIndex: index,
								});
								this.hide();
							}
						}}
					>
						<Text style={[styles.rowText, { backgroundColor: (index % 2 === 0) ? '#f6f6f6' : '#ffffff' }, this.props.rowStyle]}>
							{item}
						</Text>
					</TouchableHighlight>
				)
				}
				keyExtractor={item => item}
				automaticallyAdjustContentInsets={false}
				showsVerticalScrollIndicator={true}
				keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}
			/>
		);
	}

}
