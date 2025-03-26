import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type ChecklistItem = {
  id: string;
  text: string;
  checked: boolean;
};

type Event = {
  id: string;
  name: string;
  description: string;
  checklistItems: ChecklistItem[];
};

type EventDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'EventDetail'>;
};

export default function EventDetailScreen({ route }: EventDetailScreenProps) {
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [newItemText, setNewItemText] = useState<string>('');

  const fetchEvent = async () => {
    const docRef = doc(db, 'events', eventId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setEvent({ id: docSnap.id, ...docSnap.data() } as Event);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const addChecklistItem = async () => {
    if (!newItemText.trim() || !event) return;

    const updatedItems = [
      ...event.checklistItems,
      {
        text: newItemText,
        checked: false,
        id: Date.now().toString(),
      },
    ];

    await updateDoc(doc(db, 'events', eventId), {
      checklistItems: updatedItems,
    });
    setNewItemText('');
    fetchEvent();
  };

  const deleteItem = async (itemId: string) => {
    if (!event) return;

    const updatedItems = event.checklistItems.filter((item) => item.id !== itemId);
    await updateDoc(doc(db, 'events', eventId), {
      checklistItems: updatedItems,
    });
    fetchEvent();
  };

  if (!event) return null;

  return (
    <View>
      <Text>{event.name}</Text>
      <TextInput
        placeholder="Novo Item"
        value={newItemText}
        onChangeText={setNewItemText}
      />
      <Button title="Adicionar" onPress={addChecklistItem} />

      <FlatList
        data={event.checklistItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.text}</Text>
            <Button title="Excluir" onPress={() => deleteItem(item.id)} />
          </View>
        )}
      />
    </View>
  );
}