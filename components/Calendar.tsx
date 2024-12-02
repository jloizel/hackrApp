import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ThemedView } from '@/context/ThemedView';
import { ThemedText } from '@/context/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import Entypo from '@expo/vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';

interface MarkedDate {
  marked: boolean;
  dotColor?: string;
  language?: string
}

const CustomCalendar = () => {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: MarkedDate }>({});
  const [selectedDateLanguage, setSelectedDateLanguage] = useState<string | null>(null);
  const [selectedDateStatus, setSelectedDateStatus] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false)

  // useEffect to test with multiple dates, hardcoded data

  useEffect(() => {
    const statusData = {
      '2024-11-01': { marked: true, dotColor: 'green', language: 'ReactJS' },
      '2024-11-03': { marked: true, dotColor: 'green', language: 'ReactJS' },
      '2024-11-05': { marked: true, dotColor: 'red', language: 'ReactJS' },
      '2024-11-07': { marked: true, dotColor: 'blue', language: 'ReactJS' },
      '2024-11-09': { marked: true, dotColor: 'green', language: 'ReactJS' },
      '2024-11-10': { marked: true, dotColor: 'green', language: 'ReactJS' },
      '2024-11-12': { marked: true, dotColor: 'green', language: 'ReactJS' },
      '2024-11-14': { marked: true, dotColor: 'grey', language: 'ReactJS' },
      '2024-11-16': { marked: true, dotColor: 'green', language: 'Python' },
      '2024-11-18': { marked: true, dotColor: 'red', language: 'Python' },
      '2024-11-21': { marked: true, dotColor: 'green', language: 'Python' },
      '2024-11-22': { marked: true, dotColor: 'green', language: 'Python' },
      '2024-11-24': { marked: true, dotColor: 'blue', language: 'C++' },
      '2024-11-26': { marked: true, dotColor: 'green', language: 'C++' },
      '2024-11-28': { marked: true, dotColor: 'green', language: 'C++' },
      '2024-12-02': { marked: true, dotColor: 'red', language: 'C++' },
      '2024-12-04': { marked: true, dotColor: 'green', language: 'C++' },
      '2024-12-06': { marked: true, dotColor: 'green', language: 'JavaScript' },
      '2024-12-09': { marked: true, dotColor: 'blue', language: 'JavaScript' },
      '2024-12-11': { marked: true, dotColor: 'green', language: 'JavaScript' },
      '2024-12-13': { marked: true, dotColor: 'green', language: 'JavaScript' },
      '2024-12-15': { marked: true, dotColor: 'green', language: 'JavaScript' },
      '2024-12-17': { marked: true, dotColor: 'green', language: 'JavaScript' },
      '2024-12-19': { marked: true, dotColor: 'red', language: 'JavaScript' },
      '2024-12-21': { marked: true, dotColor: 'green', language: 'ReactJS' },
      '2024-12-23': { marked: true, dotColor: 'green', language: 'ReactJS' },
      '2024-12-25': { marked: true, dotColor: 'red', language: 'ReactJS' },
      '2024-12-27': { marked: true, dotColor: 'green', language: 'ReactJS' },
      '2024-12-29': { marked: true, dotColor: 'blue', language: 'ReactJS' },
      '2024-12-31': { marked: true, dotColor: 'green', language: 'ReactJS' }
    };

    setMarkedDates(statusData);
  }, []);

  // useEffect which should work for a user's actual activity

  // useEffect(() => {
  //   const fetchMarkedDates = async () => {
  //     const submissions = await AsyncStorage.getItem('submissionsStatus');
  //     const submissionsObj = submissions ? JSON.parse(submissions) : {};

  //     const markedDatesObj: { [key: string]: MarkedDate } = {};
  //     for (const date in submissionsObj) {
  //       if (submissionsObj.hasOwnProperty(date)) {
  //         const { status, language } = submissionsObj[date];
  //         markedDatesObj[date] = {
  //           marked: true,
  //           dotColor: status === 'correct' ? 'green' : 'red',
  //         };
  //       }
  //     }

  //     setMarkedDates(markedDatesObj);
  //   };

  //   fetchMarkedDates();
  // }, []);

  const handleDayPress = (date: { dateString: string }) => {
    const dateInfo = markedDates[date.dateString];
  
    if (!dateInfo) {
      setSelectedDateLanguage(null);
      setOpenModal(false);
      return;
    }
  
    setOpenModal(true);
  
    if (dateInfo.language) {
      setSelectedDateLanguage(dateInfo.language);
  
      // check if the puzzle is marked as correct or incorrect and change the status accordingly
      if (dateInfo.dotColor === 'green') {
        setSelectedDateStatus('successfully')
      } else {
        setSelectedDateStatus('unsuccessfully')
      }
    } else {
      setSelectedDateLanguage(null);
    }
  };


  const text = useThemeColor({ light: '#06283D', dark: '#fbfbff' }, 'text');

  return (
    <ThemedView style={styles.container}>
      <Calendar
        markedDates={markedDates}
        markingType={'custom'}
        enableSwipeMonths={true}
        style={styles.calendar}
        theme={{
          calendarBackground: "transparent",
          textDayFontFamily: 'poppins',
          textMonthFontFamily: 'poppins',
          textDayHeaderFontFamily: 'poppins',
          monthTextColor: '#00a6ff',
        }}
        dayComponent={({ date, state }) => {
          const isMarked = markedDates[date.dateString];
          return (
            <View style={styles.dayContainer}>
              <View onTouchEnd={() => handleDayPress(date)}>
                {isMarked ? (
                  <View style={styles.customMarker}>
                    {/* render the appropriate icon based on dotColor */}
                    {isMarked.dotColor === 'green' ? (
                      <Entypo name="check" size={26} color="#2dea2d" />
                    ) : (
                      <MaterialCommunityIcons name="puzzle-remove-outline" size={26} color="#ff5050" />
                    )}
                  </View>
                ) : (
                  <ThemedText style={[styles.dayText, { color: state === 'disabled' ? 'grey' : text }]}>
                    {date.day}
                  </ThemedText>
                )}
              </View>
            </View>
          );
        }}
      />
      <SafeAreaView style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={openModal}
          onRequestClose={() => {setOpenModal(!openModal)}}>
          <Pressable
            style={styles.overlay}
            onPress={() => setOpenModal(false)}
          />
          <SafeAreaView style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalTextContainer}>
                <Text style={styles.modalText}>You</Text>
                <Text style={[styles.modalText, {fontFamily: 'Poppins_LightItalic', marginRight: 5}]}>{selectedDateStatus}</Text>
                <Text style={styles.modalText}>completed a puzzle in</Text>
                <Text style={[styles.modalText, {fontFamily: 'Poppins_600Bold'}]}>{selectedDateLanguage}</Text>
              </View>
              <Pressable
                style={styles.button}
                onPress={() => setOpenModal(!openModal)}>
                <AntDesign name="close" size={24} color={'#fbfbff'}/>
              </Pressable>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  calendar: {
    paddingHorizontal: 10, 
    paddingVertical: 20, 
    width: 300,
  },
  dayContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    // width: 80,
    // height: 20
    padding: 8
  },
  dayText: {
    fontSize: 16,
  },
  customMarker: {
    // position: 'absolute',
    // top: 8, 
    // right: 0, 
    marginTop: -2
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    zIndex: -1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  modalView: {
    margin: 20,
    backgroundColor: '#00a6ff',
    // opacity: 0.6,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    padding: 10,
    position: 'absolute',
    left: 5,
    top: 5
  },
  modalTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center', 
    gap: 5,
    padding: 10
  },
  modalText: {
    textAlign: 'center',
    color: '#fbfbff',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular'
  },
});

export default CustomCalendar;
