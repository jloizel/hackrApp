import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/context/ThemedText';
import { ThemedView } from '@/context/ThemedView';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Puzzle } from '@/components/Puzzle';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {

  return (
    <ThemedView style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>Hackr</ThemedText>
      </View>
      <View>
        <Puzzle/>
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
  },
  titleContainer: {
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
  }
});
