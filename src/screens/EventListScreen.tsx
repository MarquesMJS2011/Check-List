import React, { useEffect, useState } from 'react';
import { View, FlatList, Button } from 'react-native';


import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Event = {
  id: string;
  name: string;
  description: string;
  checklistItems: ChecklistItem[];
};

type EventListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EventList'>;
};

export default function EventListScreen({ navigation }: EventListScreenProps) {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    const querySnapshot = await getDocs(collection(db, 'events'));
    const eventsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Event[];
    setEvents(eventsData);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            title={item.name}
            onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
          />
        )}
      />
      <Button
        title="Criar Novo Evento"
        onPress={() => navigation.navigate('CreateEvent')}
      />
    </View>
  );
}