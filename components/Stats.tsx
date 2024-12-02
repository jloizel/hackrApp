import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ThemedText } from '@/context/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FontAwesome6 } from '@expo/vector-icons';


export default function Stats() {
  const [maxStreak, setMaxStreak] = useState(0);
  const [mostPopularLanguage, setMostPopularLanguage] = useState('');
  const [username, setUsername] = useState('')
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [totalPuzzles, setTotalPuzzles] = useState(0)
  const [totalWins, setTotalWins] = useState(0)

  // testing useEffect

  useEffect(() => {
    const fetchData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
        setIsEditingUsername(false);
      } else {
        const defaultUsername = `Hackr${Math.floor(1000 + Math.random() * 9000)}`;
        setUsername(defaultUsername);
        setIsEditingUsername(true);  
      }

      // mock testing data for user performance
      const mockData = {
        maxStreak: 5,
        languageCounts: {
          JavaScript: 10,
          Python: 8,
          ReactJS: 15,
          Java: 5,
        },
        totalWins: 12
      };

      // find total number of puzzles solved
      const total = Object.values(mockData.languageCounts).reduce((acc, count) => acc + count, 0);
      setTotalPuzzles(total);
      setTotalWins(mockData.totalWins)
      setMaxStreak(mockData.maxStreak);

      // find most popular language
      const languageCounts = mockData.languageCounts;
      const sortedLanguages = (Object.entries(languageCounts) as [string, number][]).sort((a, b) => b[1] - a[1]);
      setMostPopularLanguage(sortedLanguages[0]?.[0] || 'None');
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchPerformanceData = async () => {
  //     const performanceKey = 'userPerformance';
  //     const usernameKey = 'username';
  
  //     try {
  //       // fetch stored username
  //       const storedUsername = await AsyncStorage.getItem(usernameKey);
  //       if (storedUsername) {
  //         setUsername(storedUsername);
  //         setIsEditingUsername(false);
  //       } else {
  //         setIsEditingUsername(true); 
  //       }
  
  //       const performanceData = await AsyncStorage.getItem(performanceKey);
  //       if (performanceData) {
  //         const data = JSON.parse(performanceData);

  //         // extract relevant data
  //         setTotalPuzzles(data.totalPuzzles);
  //         setTotalWins(data.totalWins)
  //         setMaxStreak(data.maxStreak);
  
  //         // find most popular language
  //         const languageCounts = data.languageCounts || {};
  //         const sortedLanguages = (Object.entries(languageCounts) as [string, number][])
  //           .sort((a, b) => b[1] - a[1]);
  //         setMostPopularLanguage(sortedLanguages[0]?.[0] || 'None');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching performance data:', error);
  //     }
  //   };
  
  //   fetchPerformanceData();
  // }, []);
  

  const handleSaveUsername = async () => {
    if (username.trim()) {
      await AsyncStorage.setItem('username', username);
      setIsEditingUsername(false);
    } else {
      alert('Username cannot be empty.');
    }
  };
  

  const getIconForLanguage = (language: string) => {
    switch (language) {
      case 'ReactJS':
        return <FontAwesome5 name="react" size={40} color="#61DAFB" />; 
      case 'Python':
        return <FontAwesome5 name="python" size={40} color="#3776AB" />; 
      case 'Java':
        return <FontAwesome5 name="java" size={40} color="#F7DF1E" />; 
      case 'JavaScript':
        return <Ionicons name="logo-javascript" size={40} color="#5382A1" />; 
      case 'C++':
        return <MaterialCommunityIcons name="language-cpp" size={40} color="#00599C" />; 
      default:
        return <FontAwesome5 name="question-circle" size={40} color="#999" />; 
    }
  };

  const text = useThemeColor({ light: '#06283D', dark: '#fbfbff' }, 'text');

  const themeTextColor = useThemeColor({}, 'text');

  const themedInputStyle = {
    ...styles.input,
    color: themeTextColor, 
  };

  return (
    <View style={styles.container}>
      {isEditingUsername ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={themedInputStyle}
            placeholder="Enter your username"
            placeholderTextColor={text}
            value={username}
            onChangeText={setUsername}
            textAlign='center'
            onFocus={() => setIsEditingUsername(true)} 
          />
          <TouchableOpacity style={styles.button} onPress={handleSaveUsername}>
            <Text style={styles.buttonText}>Save username</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.usernameContainer}>
        {/* <Ionicons name="person-circle-outline" size={20} color="black" /> */}
          <MaterialCommunityIcons name="face-man-profile" size={30} color='#00a6ff' style={styles.icon}/>
          <ThemedText style={styles.usernameText}>{username}</ThemedText>
        </View>
      )}
      <View style={styles.statsSection}>
        <ThemedText style={styles.sectionTitle}>Statistics</ThemedText>
        <View style={styles.statsGrid}>
          <View style={styles.statContainer}>
            <View style={styles.statRow}>
              <Ionicons name="flame" size={20} color="#fc6f4b"/>
              <ThemedText style={styles.statValue}>{maxStreak}</ThemedText>
            </View>
            <ThemedText style={styles.statLabel}>Longest streak</ThemedText>
          </View>

          <View style={styles.statContainer}>
            <View style={styles.statRow}>
              <MaterialCommunityIcons name="puzzle" size={20} color="#2dea2d"/>
              <ThemedText style={styles.statValue}>{totalPuzzles}</ThemedText>
            </View>
            <ThemedText style={styles.statLabel}>Total puzzles</ThemedText>
          </View>

          <View style={styles.statContainer}>
            <View style={styles.statRow}>
              <FontAwesome6 name="crown" size={20} color="#FFD503"/>
              <ThemedText style={styles.statValue}>{mostPopularLanguage}</ThemedText>
            </View>
            <ThemedText style={styles.statLabel}>Top language</ThemedText>
          </View>

          <View style={styles.statContainer}>
            <View style={styles.statRow}>
              <FontAwesome5 name="medal" size={20} color="#FDB948" />
              <ThemedText style={styles.statValue}>{totalWins}</ThemedText>
            </View>
            <ThemedText style={styles.statLabel}>Total wins</ThemedText>
          </View>
        </View>

        
        {/* <View style={styles.iconContainer}>
          {getIconForLanguage(mostPopularLanguage)}
        </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: 10,
    maxHeight: 340
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Poppins_400Regular',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 60,
    marginTop: 20
  },
  icon: {
    borderRadius: '50%',
    borderWidth: 1,
    borderColor: '#00a6ff',
    padding: 4
  },
  usernameText: {
    fontSize: 26,
    fontFamily: 'Poppins_600SemiBold',
    lineHeight: 30
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    height: 60,
    marginTop: 20
  },
  input: {
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    marginBottom: 10,
    fontFamily: 'Poppins_400Regular',
    fontSize: 18
  },
  iconContainer: {
    marginTop: 20,
  },
  button: {
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins_400Regular', 
    fontSize: 16,
    color: '#00a6ff'
  },
  statsSection: {
    flex: 1,
    marginTop: 30,
    flexDirection: 'column',
    gap: 10,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    lineHeight: 30
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
    // marginTop: 10,
  },
  statContainer: {
    width: '49%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    padding: 10,
    flexDirection: 'column',
    gap: 5,
    marginBottom: 10
  }, 
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statLabel: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    color: '#808080'
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#00a6ff',
    marginTop: 4
  }
});
