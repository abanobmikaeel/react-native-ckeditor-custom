import * as React from 'react';

import { View } from 'react-native';
import TaskList from './TaskList';
import Ckeditor from './Ckeditor';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <View style={{ flex: 1, backgroundColor: '#222' }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="TaskList">
          <Stack.Screen name="TaskList" component={TaskList} />
          <Stack.Screen
            name="CKEditor"
            component={Ckeditor}
            options={{ title: 'Oops' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
