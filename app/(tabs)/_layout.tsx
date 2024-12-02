import { Tabs } from 'expo-router';
import React from 'react';
import { TabBar } from '@/components/tabs/TabBar';

export default function TabLayout() {

  return (
    <Tabs tabBar={props => <TabBar {...props}/>}>
      <Tabs.Screen
        name="calendar" 
        options={{title: 'Calendar', headerShown: false}}
      />
      <Tabs.Screen
        name="index"
        options={{title: 'Puzzle', headerShown: false}}
      />
      <Tabs.Screen
        name="profile"
        options={{title: 'Profile', headerShown: false}}
      />
    </Tabs>
  );
}
