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
	ListView,
	TouchableNativeFeedback,
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
			showDropdown: false,
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
		this._updatePosition(() => {
			this.setState({
				showDropdown: true
			});
		});
	}

	hide() {
		this._updatePosition(() => {
			this.setState({
				showDropdown: false
			});
		});
	}

	select(idx) {
		let value = this.props.defaultValue;
		if (idx === null || this.props.data == null || idx >= this.props.data.length) {
			idx = this.props.defaultIndex;
		}

		if (idx >= 0) {
			value = this.props.options[idx].toString();
		}

		this._nextIndex = idx;
		this._nextValue = value;

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
				{
					<View styles={styles.button}>
						<Text style={styles.buttonText} numberOfLines={1}>
							{this.state.selectedValue}
						</Text>
						{this._renderIndicator()}
					</View>
				}
			</TouchableOpacity>
		)
	}

	_renderIndicator() {
		if (this.props.showsIndicator) {
			return (
				<Image source={this.props.Image} style={styles.indicator} />
			)
		}
		return (
			<View />
		)
	}

	_renderPlaceholder() {
		if (this.props.showsPlaceholder) {
			<View style={styles.placeholderContainer}>
				<Text style={styles.placeholderText}>
					{this.state.placeholder}
				</Text>
			</View>
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
						onPress={() => {
							this.hide();
						}}>
						<View style={styles.modal}>
							<View style={styles.dropdown}>
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
		)
	}

	_renderDropdown() {
		return (
			<ListView
				scrollEnabled={true}
				style={styles.list}
				dataSource={this._dataSource}
				renderRow={this._renderDropdown.bind(this)}
				renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => {
					const key = `spr_${rowID}`;
					return (<View style={styles.separator}
						key={key}
					/>);
				}}
				automaticallyAdjustContentInsets={false}
				showsVerticalScrollIndicator={true}
			/>
		);
	}

	get _dataSource() {
		const datasource = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		return ds.cloneWithRows(this.props.data);
	}

	_renderRow(rowData, sectionID, rowID, highlightRow) {
		return (
			<TouchableHighlight
				key={`row_${rowID}`}
				highlighted={(rowID == this.state.selectedIndex)}
				onPress={(rowData, sectionID, rowID, highlightRow) => {
					const { onSelect } = this.props;
					if (!onSelect || onSelect(rowID, rowData) !== false) {
						highlightRow(sectionID, rowID);
						this._nextValue = rowData;
						this._nextIndex = rowID;
						this.setState({
							selectedValue: rowData.toString(),
							selectedIndex: rowID,
							showDropdown: false
						});
					}
				}}
			>
				<Text style={styles.rowText}>
					{rowData}
				</Text>
			</TouchableHighlight>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
	},
	button: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
	buttonText: {
		textAlign: 'left',
		fontSize: 12,
	},
	indicator: {
		width: 16,
		height: 16,
	},
	placeholderContainer: {
		flex: 1,
		height: 12,
	},
	placeholderText: {
		textAlign: 'left',
		fontSize: 8,
	},
	modal: {
		flexGrow: 1,
	},
	dropdown: {
		position: 'absolute',
		height: (32 + StyleSheet.hairlineWidth) * 6,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'lightgray',
		justifyContent: 'center',
	},
	list: {
		flex: 1,
	},
	separator: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: 'lightgray'
	},
	rowText: {
		textAlign: 'left',
		fontSize: 10,
	}
});