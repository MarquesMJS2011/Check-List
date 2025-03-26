import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type CreateEventScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateEvent'>;
};

export default function CreateEventScreen({ navigation }: CreateEventScreenProps) {
  const [eventName, setEventName] = useState<string>('');
  const [eventDescription, setEventDescription] = useState<string>('');

  const handleCreateEvent = async () => {
    await addDoc(collection(db, 'events'), {
      name: eventName,
      description: eventDescription,
      checklistItems: [],
      createdAt: new Date(),
    });
    navigation.goBack();
  };

  return (
    <View>
      <TextInput
        placeholder="Nome do Evento"
        value={eventName}
        onChangeText={setEventName}
      />
      <TextInput
        placeholder="Descrição"
        value={eventDescription}
        onChangeText={setEventDescription}
      />
      <Button title="Criar Evento" onPress={handleCreateEvent} />
    </View>
  );
}