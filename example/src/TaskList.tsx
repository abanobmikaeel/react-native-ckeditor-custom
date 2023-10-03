// import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';

export default function TaskList({ navigation }: any) {
  // const navigation = useNavigation<any>();

  const data = [
    { name: 'task 1', data: '<p>1-912345678</p>', key: 1 },
    { name: 'task 2', data: '<p>2-912345678</p>', key: 2 },
    { name: 'task 3', data: '<p>3-912345678</p>', key: 3 },
    { name: 'task 4', data: '<p>4-912345678</p>', key: 4 },
    { name: 'task 5', data: '<p>5-912345678</p>', key: 5 },
  ];

  const pressed = (name: any, data: any) => {
    navigation.navigate('CKEditor', { name, initalData: data });
  };
  const ListItem = ({ name, data }: any) => {
    console.log('here?', data);
    return (
      <View>
        <TouchableOpacity onPress={() => pressed(name, data)}>
          <Text style={styles.headerText}>{name}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>List</Text>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View>
          {data.map((item: any) => {
            return (
              <View key={item.key}>
                <ListItem name={item.name} data={item.data} />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'purple',
    flex: 1,
    width: 100,
    height: 100,
  },
  contentContainer: {
    paddingBottom: 200,
  },
  headerText: {
    margin: 15,
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
  },
});
