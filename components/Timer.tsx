import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedText } from '@/context/ThemedText'

interface TimerProps {
  targetTime: Date;
  onCountdownComplete?: () => void;
}

const Timer: React.FC<TimerProps> = ({targetTime, onCountdownComplete}) => {
  const [countdown, setCountdown] = useState('');

  useEffect(() => { 
    const calculateTimeRemaining = () => { // function to calculate and update the countdown time remaining
      const now = new Date();
      const timeRemaining = targetTime.getTime() - now.getTime();

      if (timeRemaining <= 0) {
        setCountdown('00h 00m 00s');
        if (onCountdownComplete) onCountdownComplete(); 
        return;
      }

      // calculate hours, minutes, and seconds from the remaining time
      const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
      const seconds = Math.floor((timeRemaining / 1000) % 60);

      setCountdown(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
    };

    calculateTimeRemaining();

    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer); 
  }, [targetTime, onCountdownComplete]);

  return (
    <View>
      <ThemedText style={styles.countdown}>{countdown}</ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  countdown: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    padding: 20
  },
})

export default Timer