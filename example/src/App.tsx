import * as React from 'react';

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import CKEditor5 from 'react-native-ckeditor-custom';

export default function App() {
  const initalData = `<p>Test</p>`;
  const height = 200; // Example height in pixels
  const maxHeight = 400; // Example max height in pixels, or set it to null if not needed
  // const colors = {};
  const fontFamily = 'Arial, sans-serif'; // Example font family
  const toolbarBorderSize = '1px solid #ccc'; // Example toolbar border size and color
  const editorFocusBorderSize = '2px solid #007bff'; // Example editor focus border size and color
  const disableTooltips = false; // Set to true to disable tooltips, false otherwise
  const placeHolderText = 'Enter your text here'; // Example placeholder text
  const editorConfig = {
    // Additional editor configuration options if needed (provide an empty object or set to null if not needed)
  };
  const style = {
    backgroundColor: 'black',
    color: 'black',
  };

  const onChange = (e: any) => {
    // console.log('onChange', e);
  };

  const onError = (e: any) => {
    // console.log('onError', e);
  };

  const onFocus = (e: any) => {
    console.log('onFocus', e);
  };

  const onBlur = (e: any) => {
    // console.log('onChange', e);
  };

  const onLoadEnd = (e: any) => {
    // console.log('onLoadEnd', e);
  };

  const renderError = () => {
    return <Text>An error ocurred while rendering CKEDITOR5 editor</Text>;
  };

  const renderLoading = () => {
    return <ActivityIndicator></ActivityIndicator>;
  };
  return (
    <View style={styles.container}>
      <CKEditor5
        onChange={onChange}
        onError={onError}
        onFocus={onFocus}
        onBlur={onBlur}
        onLoadEnd={onLoadEnd}
        renderError={renderError}
        renderLoading={renderLoading}
        initialData={initalData}
        maxHeight={maxHeight}
        editorConfig={editorConfig}
        style={style}
        disableTooltips={disableTooltips}
        height={height}
        androidHardwareAccelerationDisabled={false}
        fontFamily={fontFamily}
        colors={{}}
        toolbarBorderSize={toolbarBorderSize}
        editorFocusBorderSize={editorFocusBorderSize}
        placeHolderText={placeHolderText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
