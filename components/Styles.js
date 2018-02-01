/**
 * Created by avikantz on 2/1/18
 */

import { StyleSheet } from 'react-native';

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
	textContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	textStyle: {
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
		height: 32,
		color: 'gray',
		backgroundColor: 'white',
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	highlightedRowText: {
		color: 'black'
	},
});

export default styles;