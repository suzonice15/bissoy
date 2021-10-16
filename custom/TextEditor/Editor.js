import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { actions, messages } from './const';
import { Platform } from 'react-native';
import { HTML } from './html';

const PlatformIOS = Platform.OS === 'ios';

export default class Editor extends Component {
  static defaultProps = {
    contentInset: {},
    style: {},
  };

  constructor(props) {
    super(props);
    this.onMessage = this.onMessage.bind(this);
    this.sendAction = this.sendAction.bind(this);
    this.registerToolbar = this.registerToolbar.bind(this);
    this.isInit = false;
    this.selectionChangeListeners = [];
    this.state = {
      keyboardHeight: 0,
    };
    this.focusListeners = [];
  }

  componentWillUnmount() {
    this.intervalHeight && clearInterval(this.intervalHeight);
  }

  onMessage(event) {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      switch (message.type) {
        case messages.CONTENT_HTML_RESPONSE:
          if (this.contentResolve) {
            this.contentResolve(message.data);
            this.contentResolve = undefined;
            this.contentReject = undefined;
            if (this.pendingContentHtml) {
              clearTimeout(this.pendingContentHtml);
              this.pendingContentHtml = undefined;
            }
          }
          break;
        case messages.LOG:
          console.log('FROM EDIT:', ...message.data);
          break;
        case messages.SELECTION_CHANGE: {
          const items = message.data;
          this.selectionChangeListeners.map((listener) => {
            listener(items);
          });
          break;
        }
        case messages.CONTENT_FOCUSED: {
          this.focusListeners.map((da) => da());
          break;
        }
      }
    } catch (e) {
      //alert('NON JSON MESSAGE');
    }
  }

  renderWebView = () => (
    <WebView
      useWebKit={true}
      scrollEnabled={false}
      hideKeyboardAccessoryView={true}
      keyboardDisplayRequiresUserAction={false}
      {...this.props}
      ref={(r) => {
        this.webviewBridge = r;
      }}
      onMessage={this.onMessage}
      originWhitelist={['*']}
      dataDetectorTypes={'none'}
      domStorageEnabled={false}
      bounces={false}
      javaScriptEnabled={true}
      source={{ html: HTML }}
      onLoad={() => this.init()}
    />
  );

  render() {
    return this.renderWebView();
  }

  sendAction(type, action, data) {
    let jsonString = JSON.stringify({
      type,
      name: action,
      data,
    });
    if (this.webviewBridge) {
      this.webviewBridge.postMessage(jsonString);
    }
  }

  //-------------------------------------------------------------------------------
  //--------------- Public API

  registerToolbar(listener) {
    this.selectionChangeListeners = [
      ...this.selectionChangeListeners,
      listener,
    ];
  }

  setContentFocusHandler(listener) {
    this.focusListeners.push(listener);
  }

  setContentHTML(html) {
    this.sendAction(actions.content, 'setHtml', html);
  }

  setPlaceholder(placeholder) {
    this.sendAction(actions.content, 'setPlaceholder', placeholder);
  }

  blurContentEditor() {
    this.sendAction(actions.content, 'blur');
  }

  focusContentEditor() {
    this.sendAction(actions.content, 'focus');
  }

  insertImage(attributes) {
    this.sendAction(actions.insertImage, 'result', attributes);
  }
  insertLink(attributes) {
    this.sendAction(actions.insertLink, 'result', attributes);
  }

  init() {
    let that = this;
    that.isInit = true;
    that.setContentHTML(this.props.initialContentHTML || '');
    that.setPlaceholder(this.props.placeholder);
    that.props.editorInitializedCallback &&
      that.props.editorInitializedCallback();

    this.intervalHeight = setInterval(function () {
      that.sendAction(actions.updateHeight);
    }, 200);
  }

  async getContentHtml() {
    return new Promise((resolve, reject) => {
      this.contentResolve = resolve;
      this.contentReject = reject;
      this.sendAction(actions.content, 'postHtml');

      this.pendingContentHtml = setTimeout(() => {
        if (this.contentReject) {
          this.contentReject('timeout');
        }
      }, 5000);
    });
  }
}
/*
const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerModal: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingTop: 20,
    paddingBottom: PlatformIOS ? 0 : 20,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: 'stretch',
    margin: 40,
    borderRadius: PlatformIOS ? 8 : 2,
  },
  button: {
    fontSize: 16,
    color: '#4a4a4a',
    textAlign: 'center',
  },
  inputWrapper: {
    marginTop: 5,
    marginBottom: 10,
    borderBottomColor: '#4a4a4a',
    borderBottomWidth: PlatformIOS ? 1 / PixelRatio.get() : 0,
  },
  inputTitle: {
    color: '#4a4a4a',
  },
  input: {
    height: PlatformIOS ? 20 : 40,
    paddingTop: 0,
  },
  lineSeparator: {
    height: 1 / PixelRatio.get(),
    backgroundColor: '#d5d5d5',
    marginLeft: -20,
    marginRight: -20,
    marginTop: 20,
  },
});
*/
