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
	ActivityIndicator
} from 'react-native';

const PropTypes = require('prop-types');

export default class Dropdown extends Component {

	static propTypes = {
		defaultIndex: PropTypes.number,
		defaultValue: PropTypes.string,

		placeholder: PropTypes.string,
		showsPlaceholder: PropTypes.bool,

		indicatorImageUri: PropTypes.string,
		showsIndicator: PropTypes.bool,

		style: PropTypes.object,

		data: PropTypes.array,

		onSelect: PropTypes.func
	};

	static defaultProps = {
		defaultIndex: -1,
		defaultValue: 'Select...',

		placeholder: 'Select',
		showsPlaceholder: false,

		indicatorImageUri: 'https://unicalendar.uni.edu/profiles/uni_default_install/modules/custom/uni_blocks_antares/images/down_arrow.png',
		showsIndicator: true,

		data: ['1', '2', '3', '4', '5', '6', '7', '8']
	};

	constructor(props) {
		super(props);

		this._button = null;
		this._buttonFrame = null;
		this._nextIndex = null;
		this._nextValue = null;

		this.state = {
			selectedIndex: props.defaultIndex,
			selectedValue: props.defaultValue,
			showDropdown: false,
			loading: props.data === null || props.data === undefined,
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

		this.setState({
			loading: newProps.data == null,
			selectedIndex: selectedIndex,
			selectedValue: selectedValue,
		});
	}

	render() {
		return (
			<View {...this.props}>
				<View style={styles.container}>
					{this._renderPlaceholder()}
					{this._renderButton()}
				</View>
				{this._renderModal()}
			</View>
		)
	}

	_updatePosition(callback) {
		if (this._button && this._button.measure) {
			this._button.measure((fx, fy, width, height, px, py) => {
				this._buttonFrame = { x: px, y: py, w: width, h: height };
				callback && callback();
			});
		}
	}

	show() {
		console.log('Showing dropdown.');
		this._updatePosition(() => {
			this.setState({
				showDropdown: true
			});
		});
	}

	hide() {
		console.log('Hiding dropdown.');
		this.setState({
			showDropdown: false
		});
	}

	select(idx) {
		let value = this.props.defaultValue;
		if (idx === null || this.props.data == null || idx >= this.props.data.length) {
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
		return (
			<TouchableOpacity
				ref={button => this._button = button}
				onPress={() => {
					this.show();
				}}
			>
				<View style={styles.button}>
					<Text style={styles.buttonText} numberOfLines={1}>
						{this.state.selectedValue}
					</Text>
					{this._renderIndicator()}
				</View>
			</TouchableOpacity>
		)
	}

	_renderIndicator() {
		if (this.props.showsIndicator) {
			// console.log('showing indicator');
			return (
				<Image source={{ uri: this.props.indicatorImageUri }} style={styles.indicator} />
			)
		}
		return (
			<View />
		)
	}

	_renderPlaceholder() {
		if (this.props.showsPlaceholder) {
			return (
				<View style={styles.placeholderContainer}>
					<Text style={styles.placeholderText}>
						{this.props.placeholder}
					</Text>
				</View>
			)
		}
		return (
			<View />
		)
	}

	_renderModal() {
		if (this.state.showDropdown && this._buttonFrame) {
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
							<View style={[styles.dropdown, frameStyle]}>
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

		const dropdownHeight = 180;

		const bottomSpace = windowHeight - this._buttonFrame.y - this._buttonFrame.h;
		const rightSpace = windowWidth - this._buttonFrame.x;
		const showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= this._buttonFrame.y;
		const showInLeft = rightSpace >= this._buttonFrame.x;

		let style = {
			height: dropdownHeight,
			top: showInBottom ? this._buttonFrame.y + this._buttonFrame.h : Math.max(0, this._buttonFrame.y - dropdownHeight),
		};

		if (showInLeft) {
			style.left = this._buttonFrame.x;
		} else {
			const dropdownWidth = (this.props.style && StyleSheet.flatten(this.props.style).width) || -1;
			if (dropdownWidth !== -1) {
				style.width = dropdownWidth;
			}
			style.right = rightSpace - this._buttonFrame.w;
		}

		if (this.props.adjustFrame) {
			style = this.props.adjustFrame(style) || style;
		}

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
				renderItem={ ({ item, index }) => (
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
							<Text style={styles.rowText}>
								{item}
							</Text>
						</TouchableHighlight>
					)
				}
				keyExtractor={ item => item }
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
		flexDirection: 'column',
		alignItems: 'flex-start',
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#959595',
		borderRadius: 2,
		width: 120,
	},
	button: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start'
	},
	buttonText: {
		textAlign: 'left',
		fontSize: 12,
		fontWeight: 'bold'
	},
	indicator: {
		width: 12,
		height: 12,
		marginTop: 2,
		marginLeft: 20,
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
		height: (32 + StyleSheet.hairlineWidth) * 6,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'lightgray',
		justifyContent: 'center',
		borderColor: 'lightgray',
		borderRadius: 2,
		backgroundColor: 'white',
		width: 60,
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
		textAlignVertical: 'center'
	},
	highlightedRowText: {
		color: 'black'
	},
});
