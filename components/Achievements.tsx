import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { ThemedText } from '@/context/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface Achievement {
  id: number;
  title: string;
  description: string;
  iconLibrary: 'FontAwesome6' | 'Ionicons' | 'MaterialCommunityIcons';
  icon: string;
  iconColor: string;
  backgroundColor: string;
  unlocked: boolean;
}

const achievements: Achievement[] = [
  {
    id: 1,
    title: 'React Wizard',
    description: 'Successfully hacked 10 React puzzles.',
    iconLibrary: 'FontAwesome6',
    icon: 'react',
    iconColor: '#88dded',
    backgroundColor: '#1c2c4c',
    unlocked: true,
  },
  {
    id: 2,
    title: 'Python Snake Charmer',
    description: 'Successfully hacked 10 Python puzzles.',
    iconLibrary: 'FontAwesome6',
    icon: 'python',
    iconColor: '#4584b6',
    backgroundColor: '#ffde57',
    unlocked: true,
  },
  {
    id: 3,
    title: 'JavaScript Ninja',
    description: 'Successfully hacked 10 JavaScript puzzles.',
    iconLibrary: 'Ionicons',
    icon: 'logo-javascript',
    iconColor: '#323330',
    backgroundColor: '#f0db4f',
    unlocked: true,
  },
  {
    id: 4,
    title: 'Java Guru',
    description: 'Successfully hacked 10 Java puzzles.',
    iconLibrary: 'FontAwesome6',
    icon: 'java',
    iconColor: '#5382a1',
    backgroundColor: '#f89820',
    unlocked: true,
  },
  {
    id: 5,
    title: 'C++ Architect',
    description: 'Successfully hacked 10 C++ puzzles.',
    iconLibrary: 'MaterialCommunityIcons',
    icon: 'language-cpp',
    iconColor: '#044F88',
    backgroundColor: '#5E97D0',
    unlocked: true,
  },
  {
    id: 11,
    title: 'Hackr Expert',
    description: 'Hacked 50 puzzles.',
    iconLibrary: 'FontAwesome6',
    icon: 'trophy',
    iconColor: '#FF5733', 
    backgroundColor: '#FDEDEC',
    unlocked: true,
  },
  {
    id: 12,
    title: 'Winning Streak',
    description: 'Achieved 10 consecutive hacks.',
    iconLibrary: 'FontAwesome6',
    icon: 'medal',
    iconColor: '#5DADE2', 
    backgroundColor: '#D6EAF8',
    unlocked: false,
  },
  {
    id: 16,
    title: 'Tech Polyglot',
    description: 'Hacked 5 different programming languages.',
    iconLibrary: 'Ionicons',
    icon: 'earth',
    iconColor: '#58D68D', 
    backgroundColor: '#E8F8F5', 
    unlocked: true,
  },
  {
    id: 13,
    title: 'Hackr Guru',
    description: 'Achieved 25 consecutive hacks.',
    iconLibrary: 'MaterialCommunityIcons',
    icon: 'trophy-award',
    iconColor: '#F4D03F', 
    backgroundColor: '#FCF3CF', 
    unlocked: false,
  },
  {
    id: 14,
    title: 'Hackr Wizard',
    description: 'Hacked 100 puzzles.',
    iconLibrary: 'FontAwesome6',
    icon: 'hat-wizard',
    iconColor: '#9B59B6', 
    backgroundColor: '#F5EEF8', 
    unlocked: false,
  },
];


export function Achievements() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  
  const renderIcon = (library: string, name: string, size: number, color: string) => { // function to render the icon depending on the selected library in the achievements object
    switch (library) {
      case 'FontAwesome6':
        return <FontAwesome6 name={name} size={size} color={color} />;
      case 'Ionicons':
        return <Ionicons name={name} size={size} color={color} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={name} size={size} color={color} />;
      default:
        return null; // handle unsupported libraries
    }
  };

  const handlePress = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setOpenModal(true);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Achievements</ThemedText>
      <View style={styles.achievements}>
        {achievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievementContainer}>
            <Pressable onPress={() => handlePress(achievement)}>
              <View style={[styles.iconContainer, { backgroundColor: achievement.backgroundColor }]}>
                {renderIcon(achievement.iconLibrary, achievement.icon, 24, achievement.iconColor)}
              </View>
            </Pressable>
          </View>
        ))}
      </View>

      {selectedAchievement && ( //conditionally display the modal if a user clicks on an achievement
        <SafeAreaView style={styles.centeredView}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={openModal}
            onRequestClose={() => setOpenModal(false)}
          >
            <Pressable style={styles.overlay} onPress={() => setOpenModal(false)} />
            <SafeAreaView style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.detailsContainer}>
                  {renderIcon(selectedAchievement.iconLibrary, selectedAchievement.icon, 24, selectedAchievement.iconColor)}
                  <ThemedText style={styles.title}>{selectedAchievement.title}</ThemedText>
                  <ThemedText style={styles.description}>{selectedAchievement.description}</ThemedText>
                </View>
                <Pressable
                  style={styles.button}
                  onPress={() => setOpenModal(false)}
                >
                  <AntDesign name="close" size={24} color={'#06283D'} />
                </Pressable>
              </View>
            </SafeAreaView>
          </Modal>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    marginTop: 20
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    lineHeight: 30,
  },
  achievements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  achievementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 20,
    // padding: 10,
    borderRadius: 10,
  },
  iconContainer: {
    // padding: 15,
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#06283D',
    marginTop: 5,
    marginBottom: 10,
    fontFamily: 'Poppins_600SemiBold',
  },
  description: {
    fontSize: 14,
    color: '#06283D',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fbfbff',
    width: '80%',
    // opacity: 0.6,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  button: {
    padding: 10,
    position: 'absolute',
    left: 5,
    top: 5
  },
});
