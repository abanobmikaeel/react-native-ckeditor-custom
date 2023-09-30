import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { Dimensions } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

const webapp = require('./index.html');

interface CKEditorProps {
  onChange: any;
  onError: any;
  renderError: any;
  renderLoading: any;
  initialData: string;
  maxHeight: number;
  editorConfig: any;
  style: any;
  onFocus: any;
  onBlur: any;
  disableTooltips?: boolean;
  height?: number;
  androidHardwareAccelerationDisabled?: boolean;
  fontFamily?: string;
  colors: any;
  toolbarBorderSize?: string;
  editorFocusBorderSize?: string;
  placeHolderText?: string;
  onLoadEnd: any;
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
  androidHardwareAccelerationDisabled,
  fontFamily,
  colors,
  toolbarBorderSize,
  editorFocusBorderSize,
  placeHolderText,
  onLoadEnd,
}: CKEditorProps) => {
  const currentHeight = height ?? 150;
  const webview = useRef(null);
  const onMessage = (event: WebViewMessageEvent) => {
    const data = event.nativeEvent.data;

    if (data.indexOf('RNCKEditor5') === 0) {
      const [_, cmd, value] = data.split(':');
      console.log(cmd, value);
      console.log(event);
      switch (cmd) {
        case 'onFocus':
          if (value === 'true' && onFocus) onFocus();
          if (value === 'false' && onBlur) onBlur();
        // webView.injectJavaScript(
        //   `document.querySelector( '.ck-editor__editable' ).blur()`
        // );
      }
    }
    onChange(data);
  };

  const injectedJS = `
  window.onload = function() {
    ClassicEditor
        .create(document.querySelector('#editor1'), ${JSON.stringify(
          editorConfig
        )}, ${JSON.stringify(placeHolderText)})
        .then(editor => {
            window.editor = editor;
            // Set initial data after editor is ready
            window.editor.setData(\`${initialData}\`);
            window.editor.placeHolder(\`${placeHolderText}\`)
            var style = document.createElement("style");
            style.type = "text/css";
            style.innerHTML = \`
                .ck-editor__editable {
                    currentHeight: ${currentHeight}px;
                    max-currentHeight: ${maxHeight || currentHeight}px;
                }
                /* Add more CSS rules as needed */
            \`;
            document.head.appendChild(style);
        })
        .catch(error => {
            console.error(error);
        });
    };


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
      border-style: none;
    }
    .ck .ck-toolbar {
      background: ${colors.offContentBackground};
      border: ${toolbarBorderSize};
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
`;

  // You can now use the injectedCSS variable as the injectedJavascript prop in React Native WebView.

  return (
    <SafeAreaView>
      <WebView
        ref={webview}
        injectedJavaScript={injectedJS}
        style={{
          width: Dimensions.get('screen').width,
          margin: 5,
          overflow: 'hidden',
          ...style,
        }}
        scrollEnabled={true}
        source={webapp}
        scalesPageToFit={true}
        onError={onError}
        renderError={renderError}
        javaScriptEnabled
        onLoadEnd={onLoadEnd}
        onHttpError={onError}
        onMessage={onMessage}
        androidHardwareAccelerationDisabled={
          androidHardwareAccelerationDisabled
        }
        renderLoading={renderLoading}
        mixedContentMode="always"
      />
    </SafeAreaView>
  );
};

export default CKEditor5;
