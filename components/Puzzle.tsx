import React, { useState, useEffect, useContext } from 'react';
import { Button, Alert, StyleSheet, Text, View, TextInput, ActivityIndicator, ScrollView, useColorScheme, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/context/ThemedView';
import { ThemedText } from '@/context/ThemedText';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import ParallaxScrollView from './ParallaxScrollView';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Timer from './Timer';
import { ThemeContext } from '@/context/ThemeContext';
import { useTheme } from '@/hooks/useTheme';
import TypeWriter from 'react-native-typewriter'
import CodeHighlighter from "react-native-code-highlighter";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { solarizedLight, github, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';




export function Puzzle() {
  const [puzzle, setPuzzle] = useState('');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ReactJS');
  const [isButtonVisible, setButtonVisible] = useState(true);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState('');
  const [showPuzzle, setShowPuzzle] = useState(true); 
  const [showAnswerInput, setShowAnswerInput] = useState(false);
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false);
  const today = new Date().toDateString();
  const [typingCompleted, setTypingCompleted] = useState(false);
  const [typewriterKey, setTypewriterKey] = useState(0);

  const [targetTime, setTargetTime] = useState(() => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    return midnight;
  });

  const themeTextColor = useThemeColor({}, 'text');

  const themedInputStyle = {
    ...styles.input,
    color: themeTextColor, 
  };

  useEffect(() => {
    initializeDailyState();
  }, []);

  const initializeDailyState = async () => {
    const today = new Date().toISOString().split('T')[0];
  
    const submissions = await AsyncStorage.getItem('submissionsStatus');
    const submissionsObj = submissions ? JSON.parse(submissions) : {};
  
    if (submissionsObj[today]) {
      setHasSubmittedToday(true);
    } else {
      submissionsObj[today] = 'notSubmitted';
      await AsyncStorage.setItem('submissionsStatus', JSON.stringify(submissionsObj));
      setHasSubmittedToday(false);
    }
  };
  

  // function passed down to Timer component, reset all constants i.e. provide a new puzzle
  const handleCountdownComplete = async () => {    
    await AsyncStorage.setItem('submissionStatus', 'notSubmitted');
    setHasSubmittedToday(false);
    setShowPuzzle(true);
    setShowAnswerInput(false);
  
    setPuzzle('');
    setAnswerFeedback('');
  };

  const apiUrl = "https://api.openai.com/v1/chat/completions"
  const api_key = process.env.EXPO_PUBLIC_OPENAI_KEY

  const getPuzzlePrompt = (language: string) => {
    return `I am building an app to help people practice ${language} skills. As an expert ${language} teacher with 10 years of experience, please generate a puzzle for a mobile app for users to solve. The puzzle should be clear and concise (e.g., find the error, fill the blank). When providing the code, please always enclose it in triple backticks (i.e., \`\`\`) to format the code as a block. Can you always start with the code block and then give the instructions please.`;
  };

  const getAnswerPrompt = (language: string, userAnswer: string) => {
    return `You are an expert ${language} teacher. The user has submitted the following answer: "${userAnswer}". Your task is to evaluate this answer. If the answer is correct, respond with 'Correct'. If the answer is incorrect, respond with 'Incorrect' and provide the correct answer to the problem. Ensure you always provide the correct answer, even if the user's submission is not complete or is incorrect. Do not omit the answer and do not ask the user to proivde more information, just provide the correct answer you were expecting.`;
  };

  const handleLanguageSelect   = async (itemValue: any) => {
    setSelectedLanguage(itemValue);
    setPickerVisible(false);
    setLoading(true);

    const prompt = getPuzzlePrompt(itemValue);

    try {
      const response = await axios.post(apiUrl, {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: prompt }],
        max_tokens: 100,
        temperature: 0.7,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api_key}`,
        }
      });
      const text = response.data.choices[0].message.content.trim();
      setPuzzle(text);

    } catch (error) {
      console.error('Error fetching data from API:', error);
      Alert.alert('Error', 'An error occurred while fetching the puzzle.');
    } finally {
      setLoading(false);
    }
  };

  const updatePerformanceData = async (isCorrect: boolean, selectedLanguage: string) => {
    const performanceKey = 'userPerformance';
    const performanceData = await AsyncStorage.getItem(performanceKey);
  
    const data = performanceData
      ? JSON.parse(performanceData)
      : { streak: 0, maxStreak: 0, languageCounts: {}, totalWins: 0 };
  
    if (isCorrect) {
      data.streak += 1;
      data.maxStreak = Math.max(data.streak, data.maxStreak);
      data.totalWins = (data.totalWins || 0) + 1; 
    } else {
      data.streak = 0;
    }
  
    if (data.languageCounts[selectedLanguage]) {
      data.languageCounts[selectedLanguage] += 1;
    } else {
      data.languageCounts[selectedLanguage] = 1;
    }
  
    await AsyncStorage.setItem(performanceKey, JSON.stringify(data));
  };
  

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      Alert.alert('Please enter an answer before submitting');
      return;
    }

    setLoading(true);

    const prompt = getAnswerPrompt(selectedLanguage, userAnswer);

    try {
      const response = await axios.post(
        apiUrl,
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'system', content: prompt }],
          max_tokens: 100,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${api_key}`,
          },
        }
      );

      const feedback = response.data.choices[0].message.content.trim();
      updatePerformanceData(feedback.startsWith('Correct'), selectedLanguage);
      setAnswerFeedback(feedback);

      // track correct or incorrect answer of user
      const status = feedback.startsWith('Correct') ? 'correct' : 'incorrect';
      const todayKey = `submissionStatus:${today}`;
      await AsyncStorage.setItem(todayKey, JSON.stringify({ status, language: selectedLanguage }));

      // track that user has submitted an answer today
      await AsyncStorage.setItem('submissionStatus', 'submitted');
      setHasSubmittedToday(true);

    } catch (error) {
      Alert.alert('Error', 'An error occurred while validating the answer.');
    } finally {
      setLoading(false); 
      setShowPuzzle(false);
      setShowAnswerInput(false);
    }
  };

  const handleButtonClick = () => {
    setButtonVisible(false)
    setPickerVisible(true)
  };

  const handleArrowButtonClick = () => {
    setShowPuzzle(false);
    setShowAnswerInput(true);
  };

  const renderFormattedText = (text: string) => {
    const regex = /```([\s\S]*?)```/g; 
    const parts = text.split(regex);
  
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const languageToUse = selectedLanguage.toLowerCase() === 'reactjs' ? 'javascript' : selectedLanguage.toLowerCase();
  
        return (
          <View style={styles.codeContainer} key={index}>
            <CodeHighlighter
              language={languageToUse}
              hljsStyle={docco}
              containerStyle={styles.codeBlock}
              textStyle={styles.codeText}
              // wrapLines={true}
              // wrapLongLines={true} 
            >
              {part.trim()}
            </CodeHighlighter>
          </View>
        );
      }

      // Regular text
      return <ThemedText key={index} style={styles.puzzleText}>{part}</ThemedText>;
    });
  };
  
  useEffect(() => {
    if (typingCompleted) {
      setTypewriterKey((prevKey) => prevKey + 1);
    }
  }, [typingCompleted]);


  //enable daily puzzle feature

  // if (hasSubmittedToday) {
  //   return (
  //     <ThemedView style={styles.container}>
  //       <ThemedText style={styles.message}>You’ve already played a puzzle today. Play again in:</ThemedText>
  //       <Timer targetTime={targetTime} onCountdownComplete={handleCountdownComplete} />
  //     </ThemedView>
  //   );
  // }

  const text = useThemeColor({ light: '#06283D', dark: '#fbfbff' }, 'text');

  return (
    <View style={styles.container}>
      {isButtonVisible && (
        <View style={{marginTop: 100}}>
          <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
            <Text style={[styles.buttonText, {color: '#fff'}]}>Choose your language</Text>
          </TouchableOpacity>
        </View>
      )}

      {isPickerVisible && (
        <View style={styles.picker}>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue) => handleLanguageSelect (itemValue)}
            itemStyle={{ color: text, fontFamily:"Poppins" }}
          >
            <Picker.Item label="ReactJS" value="ReactJS"/>
            <Picker.Item label="Python" value="Python"/>
            <Picker.Item label="JavaScript" value="JavaScript"/>
            <Picker.Item label="Java" value="Java"/>
            <Picker.Item label="C++" value="C++"/>
          </Picker>
        </View>
      )}

      <ThemedText style={styles.loading}>
        {loading && (
          <ActivityIndicator size="large" color="#00a6ff" />
        )}
      </ThemedText>

      <View>
        {showPuzzle && !loading && puzzle && (
          <View >
            <View style={styles.scrollContainer}>
              <ScrollView contentContainerStyle={styles.scrollView}>
                <ThemedText style={styles.puzzleText}>
                  <TypeWriter 
                    key={typewriterKey}
                    typing={1} 
                    // onTypingEnd={() => setTypingCompleted(true)}
                    maxDelay={50}
                  >
                    {renderFormattedText(puzzle)}
                  </TypeWriter>
                </ThemedText>
              </ScrollView>
            </View>
            {/* {typingCompleted && ( */}
              <View style={{ marginTop: 20 }}>
                <TouchableOpacity style={styles.arrowButton} onPress={handleArrowButtonClick}>
                  <ThemedText>
                    <FontAwesome name="long-arrow-right" size={24} />
                  </ThemedText>
                  <ThemedText>Submit your answer</ThemedText>
                </TouchableOpacity>
              </View>
            {/* )} */}
          </View>
        )}
      </View>

      {showAnswerInput && !loading && (
        <View style={styles.answerContainer}>
          <View style={styles.answerScrollContainer}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.answerScrollView}>
              <TextInput
                style={themedInputStyle}
                value={userAnswer}
                onChangeText={setUserAnswer}
                placeholder="Type your answer here"
                placeholderTextColor={text}
                multiline={true}
                textAlignVertical="top" 
                scrollEnabled={true}
                onSubmitEditing={()=>{Keyboard.dismiss()}}
                blurOnSubmit={true}
              />
            </ScrollView>
          </TouchableWithoutFeedback>
          </View>
          <View>
            <TouchableOpacity style={styles.button} onPress={handleSubmitAnswer}>
              <Text style={[styles.buttonText, {color: '#fff'}]}>Submit Answer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

        <View>
          {!loading && answerFeedback && (
            <View>
            <View style={styles.scrollContainer}>
              <ScrollView contentContainerStyle={styles.scrollView}>
                <ThemedText style={styles.puzzleText}>
                  <TypeWriter 
                    key={typewriterKey}
                    typing={1} 
                    // onTypingEnd={() => setTypingCompleted(true)}
                    maxDelay={50}
                  >
                    {renderFormattedText(answerFeedback)}
                  </TypeWriter>
                </ThemedText>
              </ScrollView>
            </View>
            {/* <View style={styles.textContainer}>
              <ThemedText style={styles.smallText}>Come back tomorrow for another Hackr puzzle</ThemedText>
            </View> */}
            </View>
          )}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  message:{ 
    fontSize: 18, 
    textAlign: 'center', 
    padding: 30,
    fontFamily: 'Poppins_400Regular', 
  },
  container: {
    flexDirection: 'column',
    // paddingTop: 0, 
    // paddingBottom: 10,
    position: 'relative',
    alignItems: 'center',
    marginTop: 100,
    height: '100%'
  },
  button: {
    backgroundColor: '#00a6ff', 
    borderRadius: 5, 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins_400Regular', 
    fontSize: 18,
  },
  arrowButton: {
    // backgroundColor: '#00a6ff', 
    borderRadius: 5, 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  picker: {
    marginTop: 20,
    width: 300,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  loading: {
    marginTop: 100
  },
  scrollContainer: {
    backgroundColor: '#F7F7F7', 
    paddingVertical: 20,
    borderRadius: 10,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    maxHeight: 400,
    marginTop: -160
  },
  scrollView: {
    flexGrow: 1, 
    alignItems: 'center',
    overflow: 'hidden',
    width: 300,
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    marginBottom: 20,
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center'
  },
  puzzleText: {
    fontFamily: 'Roboto_Light', 
    fontSize: 16,
    textAlign: 'left', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 20, 
    maxWidth: 300, 
    alignSelf: 'flex-start',
    color: '#06283D'
  },
  answerContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    // gap: 20,
  },
  answerScrollContainer: {
    paddingVertical: 20,
    borderRadius: 10,
    maxHeight: 320,
    marginTop: -160
  },
  answerScrollView: {
    flexGrow: 1, 
    alignItems: 'center',
    overflow: 'hidden',
    width: 300,
    maxHeight: 300
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    width: 300,
    borderRadius: 5,
    fontFamily: 'Poppins_400Regular',
    minHeight: 100,
    maxHeight: 280
  },
  textContainer: {
    marginTop: 20,
    width: 300,
    alignItems: 'center',
  },
  smallText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
  },
  codeBlock: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%'
  },
  codeContainer: {
    width: '100%', 
    backgroundColor: '#F9F9F9',
    borderRadius: 5,
    padding: 10,
  },
  codeText: {
    fontSize: 14,
    fontFamily: 'Courier New', 
  },
});
