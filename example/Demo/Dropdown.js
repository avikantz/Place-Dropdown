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
	TouchableNativeFeedback,
	TouchableWithoutFeedback,
	TouchableHighlight,
	Modal,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	Platform,
	StatusBar,
	Animated
} from 'react-native';

import PropTypes from 'prop-types'

export default class Dropdown extends Component {

	static propTypes = {
		defaultIndex: PropTypes.number,
		defaultValue: PropTypes.string,

		placeholder: PropTypes.string,
		showsPlaceholder: PropTypes.bool,

		indicatorImageUri: PropTypes.string,
		showsIndicator: PropTypes.bool,

		style: PropTypes.object,
		dropdownStyle: PropTypes.object,

		data: PropTypes.array,

		onSelect: PropTypes.func
	};

	static defaultProps = {
		defaultIndex: -1,
		defaultValue: 'Select...',

		placeholder: 'Select',
		showsPlaceholder: false,

		indicatorImageUri: 'https://i.imgur.com/RVuQJh0.png',
		showsIndicator: true,

		data: ['1', '2', '3', '4', '5', '6', '7', '8']
	};

	constructor(props) {
		super(props);

		this._viewRef = null;
		this._viewRefFrame = null;
		this._nextIndex = null;
		this._nextValue = null;

		this.state = {
			selectedIndex: props.defaultIndex,
			selectedValue: props.defaultValue,
			showDropdown: false,
			loading: props.data === null || props.data === undefined,
			placeholderAnimatorValue: 0,
		};
	}

	componentWillReceiveProps(newProps) {
		let selectedValue = this._nextValue == null ? this.state.selectedValue : this._nextValue.toString();
		let selectedIndex = this._nextIndex == null ? this.state.selectedIndex : this._nextIndex;
		if (selectedIndex < 0) {
			selectedIndex = newProps.defaultIndex;
			if (selectedIndex < 0) {
				selectedValue = newProps.defaultValue;
			}
		}
		this._nextValue = null;
		this._nextIndex = null;

		if (selectedValue !== '') {
			// Animated.timing(this.state.placeholderAnimatorValue, {toValue: 0, duration: 1500}).start();
		}

		this.setState({
			loading: newProps.data == null,
			selectedIndex: selectedIndex,
			selectedValue: selectedValue,
		});
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
		this._updatePosition(() => {
			this.setState({
				showDropdown: true
			});
		});
	}

	hide() {
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
					<View style={styles.button}>
						{this._renderPlaceholder()}
						<Text style={[styles.buttonText, placeStyle]} numberOfLines={1}>
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
				<Image source={{ uri: this.props.indicatorImageUri }} style={styles.indicator} />
			)
		}
	}

	_renderPlaceholder() {
		if (this.props.showsPlaceholder) {
			var placeStyle = (this.state.selectedValue == '') ? { transform: [ { translateY: 9 * this.state.placeholderAnimatorValue }, { translateX: 8 * this.state.placeholderAnimatorValue }, { scaleX: Math.max(this.state.placeholderAnimatorValue * 4/3, 1) }, { scaleY: Math.max(this.state.placeholderAnimatorValue * 4/3, 1) } ] } : {};
			return (
				<View style={[styles.placeholderContainer, placeStyle]}>
					<Text style={styles.placeholderText}>
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
						<View style={styles.modal}>
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

		const dropdownHeight = 160;

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
						<Text style={[styles.rowText, { backgroundColor: (index % 2 === 0) ? '#f6f6f6' : '#ffffff' }]}>
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

const styles = StyleSheet.create({
	container: {
		padding: 8,
		position: 'absolute',
		flex: 1,
		flexDirection: 'row',
		borderWidth: 0.7,
		borderColor: '#959595',
		width: 80,
		justifyContent: 'center',
	},
	button: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	buttonText: {
		textAlign: 'center',
		fontSize: 12,
		flexGrow: 1,
	},
	indicator: {
		width: 9,
		height: 9,
		margin: 3,
		alignSelf: 'center',
	},
	placeholderContainer: {
		alignSelf: 'flex-start',
		height: 12,
		marginBottom: 4,
	},
	placeholderText: {
		textAlign: 'left',
		fontSize: 9,
	},
	modal: {
		flexGrow: 1,
	},
	loading: {
		alignSelf: 'center'
	},
	dropdown: {
		position: 'absolute',
		height: (32 + StyleSheet.hairlineWidth) * 5, // Default
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'lightgray',
		justifyContent: 'center',
		backgroundColor: 'white',
	},
	list: {
		flex: 1,
	},
	separator: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: 'lightgray'
	},
	rowText: {
		fontSize: 10,
		paddingHorizontal: 6,
		paddingVertical: 10,
		color: 'gray',
		backgroundColor: 'white',
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	highlightedRowText: {
		color: 'black'
	},
});
