import React, { Component } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { actions } from './const';
import { Icon } from 'native-base';

const defaultActions = [
  actions.setBold,
  actions.setItalic,
  actions.setUnderline,
  actions.insertBulletsList,
  actions.insertOrderedList,
  actions.insertLink,
  actions.insertImage,
];

function defaultIcons() {
  const iconNames = {};
  iconNames[actions.setBold] = 'format-bold';
  iconNames[actions.setItalic] = 'format-italic';
  iconNames[actions.setUnderline] = 'format-underline';
  iconNames[actions.insertBulletsList] = 'format-list-bulleted';
  iconNames[actions.insertOrderedList] = 'format-list-numbered';
  iconNames[actions.insertLink] = 'link';
  iconNames[actions.insertImage] = 'image-area';

  return iconNames;
}

export default class RichTools extends Component {
  static defaultProps = {
    actions: defaultActions,
  };

  constructor(props) {
    super(props);
    this.state = {
      editor: undefined,
      selectedItems: [],
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    let that = this;
    return (
      nextProps.actions !== that.props.actions ||
      nextState.editor !== that.state.editor ||
      nextState.selectedItems !== that.state.selectedItems ||
      nextState.actions !== that.state.actions
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { actions } = nextProps;
    if (actions !== prevState.actions) {
      let { selectedItems = [] } = prevState;
      return {
        actions,
        data: actions.map((action) => ({
          action,
          selected: selectedItems.includes(action),
        })),
      };
    }
    return null;
  }

  componentDidMount() {
    const editor = this.props.getEditor();
    if (!editor) {
      throw new Error('Toolbar has no editor!');
    } else {
      editor.registerToolbar((selectedItems) =>
        this.setSelectedItems(selectedItems)
      );
      this.setState({ editor });
    }
  }

  setSelectedItems(selectedItems) {
    if (selectedItems !== this.state.selectedItems) {
      this.setState({
        selectedItems,
        data: this.state.actions.map((action) => ({
          action,
          selected: selectedItems.includes(action),
        })),
      });
    }
  }

  buttonIcons(action) {
    if (defaultIcons()[action]) {
      return defaultIcons()[action];
    } else {
      return undefined;
    }
  }

  renderAction(action, selected) {
    const iconName = this.buttonIcons(action);
    const { iconSize = 32 } = this.props;
    return (
      <TouchableOpacity
        key={action}
        style={styles.main}
        onPress={() => this.onToolbarItemPressed(action)}>
        {iconName ? (
          <Icon
            type="MaterialCommunityIcons"
            name={iconName}
            style={[
              {
                fontSize: iconSize,
              },
              selected ? styles.selectedButton : styles.unselectedButton,
            ]}
          />
        ) : null}
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View
        style={[
          { height: 50, backgroundColor: '#fafafa', alignItems: 'center' },
          this.props.style,
        ]}>
        <FlatList
          horizontal
          keyExtractor={(item, index) => item.action + '-' + index}
          data={this.state.data}
          alwaysBounceHorizontal={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) =>
            this.renderAction(item.action, item.selected)
          }
        />
      </View>
    );
  }

  onToolbarItemPressed(action) {
    this.editor?.focusContentEditor();
    switch (action) {
      case actions.setBold:
      case actions.setItalic:
      case actions.insertBulletsList:
      case actions.insertOrderedList:
      case actions.setUnderline:
      case actions.heading1:
      case actions.heading2:
      case actions.heading3:
      case actions.heading4:
      case actions.heading5:
      case actions.heading6:
      case actions.setParagraph:
      case actions.removeFormat:
      case actions.alignLeft:
      case actions.alignCenter:
      case actions.alignRight:
      case actions.alignFull:
      case actions.setSubscript:
      case actions.setSuperscript:
      case actions.setStrikethrough:
      case actions.setHR:
      case actions.setIndent:
      case actions.setOutdent:
        this.state.editor.sendAction(action, 'result');
        break;
      case actions.insertLink:
        if (this.props.onPressAddLink) {
          this.props.onPressAddLink();
        }
        break;
      case actions.insertImage:
        if (this.props.onPressAddImage) {
          this.props.onPressAddImage();
        }
        break;
    }
  }
}

const styles = StyleSheet.create({
  main: {
    justifyContent: 'center',
    margin: 3,
  },
  selectedButton: {
    color: 'dodgerblue',
  },
  unselectedButton: { color: '#999' },
});
