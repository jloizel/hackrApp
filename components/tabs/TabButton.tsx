import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { icons, RouteName } from '@/constants/Icon';

interface TabButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  onLongPress: (event: GestureResponderEvent) => void;
  isFocused: boolean;
  routeName: string;
  color: string;
  label: string;
}


const TabButton: React.FC<TabButtonProps> =({onPress, onLongPress, isFocused, routeName, color, label}) => {

  const scale = useSharedValue(0)

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused])

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]) //slightly scale the icon on press

    const top = interpolate(scale.value, [0, 1], [0, 9]) //slighlty move the icon down on press

    return {
      transform: [{
        scale: scaleValue
      }],
      top
    }
  }, [scale.value])

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0])

    return {
      opacity
    }
  }, [scale.value])
  
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabbarItem}
    >
      <Animated.View style={animatedIconStyle}>
        {icons[routeName as RouteName]({
          color: isFocused ? "#fff" : '#9a9c9a'
        })}
      </Animated.View>
      <Animated.Text style={[styles.label, animatedTextStyle, { color: isFocused ? "#fff" : '#9a9c9a' } ]}>
        {label}
      </Animated.Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  tabbarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  label: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 10
  }
})

export default TabButton