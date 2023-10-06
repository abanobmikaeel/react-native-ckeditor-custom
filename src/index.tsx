import React, { useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

const webapp = require('./index.html');

interface CKEditorProps {
  onChange?: any;
  onError?: any;
  renderError?: any;
  renderLoading?: any;
  initialData?: string;
  maxHeight?: number;
  editorConfig?: any;
  style?: any;
  onFocus?: any;
  onBlur?: any;
  disableTooltips?: boolean;
  height?: number;
  androidHardwareAccelerationDisabled?: boolean;
  fontFamily?: string;
  colors?: any;
  toolbarBorderSize?: string;
  editorFocusBorderSize?: string;
  onLoadEnd?: any;
  injectedJavascript?: string;
}

export const CKEditor5 = ({
  onChange,
  onError,
  renderError,
  renderLoading,
  initialData,
  maxHeight,
  editorConfig,
  style,
  onFocus,
  onBlur,
  disableTooltips,
  height,
  fontFamily,
  colors,
  toolbarBorderSize,
  editorFocusBorderSize,
  onLoadEnd,
  injectedJavascript,
}: CKEditorProps) => {
  type WebViewRef = React.RefObject<WebView>;

  const currentHeight = height ?? 150;
  const webview: WebViewRef = useRef<WebView>(null);

  const onMessage = (event: WebViewMessageEvent) => {
    const data = event.nativeEvent.data;
    if (data.indexOf('RNCKEditor5') === 0) {
      console.log(data);
      const [_, cmd, value] = data.split(':');
      console.log(cmd);
      switch (cmd) {
        case 'onFocus':
          if (value === 'true' && onFocus) onFocus();
          if (value === 'false' && onBlur) onBlur();
      }
    }
    onChange(data);
  };

  useEffect(() => {
    const webviewRef = webview.current;
    return () => {
      if (webviewRef) {
        webviewRef.injectJavaScript(
          `element.removeEventListener("cleanupLater", cleanupLater, true);
          const editorElement = document.querySelector('#editor1');
          if (editorElement) {
            editorElement.parentNode.removeChild(editorElement);
          }
          true;`
        );
        webviewRef?.stopLoading();
      }
    };
  }, []);

  const injectedJS = `
     window.onload = function() {
       ClassicEditor.create( document.querySelector( '#editor1' ), ${JSON.stringify(
         editorConfig || {}
       )})
          .then(editor => {
            window.editor = editor;
            editor.model.document.on('change:data', () => {
              try {
                window.ReactNativeWebView.postMessage(editor.getData(), "*")
              }
              catch (e) {
                alert(e)
              }
            });
            editor.editing.view.document.on('change:isFocused',
              (evt, name, value) => {
                window.ReactNativeWebView.postMessage(
                  'RNCKEditor5:onFocus:' + value, "*"
                );
              }
            );
            // Set initial data after editor is ready
            editor.setData(\`${initialData}\`);
          })
          .catch(error => {
              console.error(error);
          });
      };
      const cleanupLater = (data) => {
          console.log(data.data);
          editor.setData(data.data);
      }
      document.addEventListener("message", cleanupLater)

      var style = document.createElement("style");
      style.type = "text/css";
      style.innerHTML = \`
      .ck-editor__editable {
        currentHeight: ${currentHeight}px;
        max-currentHeight: ${maxHeight || currentHeight}px;
      }
      .ck.ck-editor__main > .ck-editor__editable {
        background: ${colors.backgroundColor};
        color: ${colors.white};
        font-family: ${
          fontFamily || '-apple-system, "Helvetica Neue", "Lucida Grande"'
        };
        border-style: '2px solid #007bff';
      }
      .ck .ck-toolbar {
        background: ${colors.offContentBackground ?? 'gray'};
        border: ${toolbarBorderSize ?? 1};
        position: -webkit-sticky; /* Safari */
        position: sticky;
        top: 0;
      }
      .ck.ck-reset_all, .ck.ck-reset_all * {
        color: ${colors.white}
      }
      .ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-focused {
        border: ${editorFocusBorderSize};
      }
      .ck-toolbar .ck-on .ck.ck-icon, .ck-toolbar .ck-on .ck.ck-icon * {
        color: ${colors.bg5} !important;
      }
      ${
        disableTooltips
          ? `
      .ck.ck-button .ck.ck-tooltip {
          display: none;
      }
      `
          : ''
      }
      \`
      document.head.appendChild(style);
      \`${injectedJavascript}\`;
      window.onerror = function(message, sourcefile, lineno, colno, error) {
        alert("Message: " + message + " - Source: " + sourcefile + " Line: " + lineno + ":" + colno);
        return true;
      };

      true;
  `;

  return (
    <SafeAreaView>
      <WebView
        ref={webview}
        injectedJavaScript={injectedJS}
        style={{
          ...styles.webview,
          ...style,
        }}
        originWhitelist={['*']}
        incognito={true}
        cacheEnabled={false}
        cacheMode={'LOAD_NO_CACHE'}
        scrollEnabled={true}
        source={webapp}
        scalesPageToFit={true}
        onError={onError}
        renderError={renderError}
        onContentProcessDidTerminate={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('Content process terminated, reloading', nativeEvent);
          webview.current?.reload();
        }}
        javaScriptEnabled
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        allowFileAccess={true}
        domStorageEnabled={false}
        onLoadEnd={onLoadEnd}
        onHttpError={onError}
        onMessage={onMessage}
        renderLoading={renderLoading}
        mixedContentMode="always"
        automaticallyAdjustContentInsets={false}
      />
    </SafeAreaView>
  );
};

export default CKEditor5;

const styles = StyleSheet.create({
  webview: {
    width: Dimensions.get('screen').width,
    margin: 5,
    overflow: 'hidden',
  },
});
