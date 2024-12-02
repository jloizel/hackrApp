import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/context/ThemedText';
import { ThemedView } from '@/context/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggle } from '@/components/ThemeToggle';
import Stats from '@/components/Stats';
import { Achievements } from '@/components/Achievements';

export default function TabTwoScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>Hackr</ThemedText>
      </View>
      <View style={styles.profileContainer}>
        <Stats/>
        {/* <Achievements/> */}
      </View>
      <View style={styles.profileContainer}>
        {/* <Stats/> */}
        <Achievements/>
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
  profileContainer: {
    
  }
});
