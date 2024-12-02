import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TabBar } from '@/components/tabs/TabBar';

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
