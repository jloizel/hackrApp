import { StyleSheet, Image, Platform, View } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/context/ThemedText';
import { ThemedView } from '@/context/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Calendar from '@/components/Calendar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function TabTwoScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>Hackr</ThemedText>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar/>
      </View>
      <SafeAreaView style={styles.toggleContainer}>
        <ThemeToggle />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    position: 'relative', 
    alignItems: 'center',
    flex: 1
  },
  titleContainer: {
    // alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 0
  },
  title: {
    fontFamily: 'Poppins_600Bold',
    fontSize: 40,
    paddingTop: 100,
    
  },
  toggleContainer: {
    position: 'absolute',  
    top: -50,               
    right: 10,             
    zIndex: 10,           
  },
  calendarContainer: {

  }
});
