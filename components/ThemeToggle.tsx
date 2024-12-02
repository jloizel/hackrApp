import { StyleSheet } from 'react-native';
import { ThemedView } from '@/context/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useThemeColor } from '@/hooks/useThemeColor';


export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const toggleIconColor = useThemeColor({ light: '#06283D', dark: '#fbfbff' }, 'toggleColor'); // change color of icon depending on the selected theme

  return (
    <ThemedView style={styles.container}>
      {theme.dark ? (
        <Entypo
          name="moon"
          size={28}
          onPress={toggleTheme}
          style={[styles.icon, { color: toggleIconColor }]}
        />
      ) : (
        <Feather
          name="sun"
          size={28}
          onPress={toggleTheme} 
          style={[styles.icon, { color: toggleIconColor }]}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  icon: {
    // borderRadius: '50%',
    // borderWidth: 1,   
    // padding: 5,
  }
});
