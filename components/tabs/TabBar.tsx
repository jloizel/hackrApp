import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TabButton from './TabButton';
import { useEffect, useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export function TabBar({ state, descriptors, navigation } : BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ height: 20, width: 100})

  const buttonWidth = dimensions.width / state.routes.length; //get width of each tab button
  const tabPositionX = useSharedValue(buttonWidth * state.index);
  
  useEffect(() => {
    tabPositionX.value = withSpring(buttonWidth * state.index, { duration: 1500 }); //have the button on the middle page as initial state
  }, [state.index, buttonWidth]);

  const onTabBarLayout = (e: LayoutChangeEvent) => { //change position of the button when selected tab changes
    const { height, width } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setDimensions({ height, width });
    }
  };


  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: tabPositionX.value}]
    }
  }, [tabPositionX])

  return (
    <View onLayout={onTabBarLayout} style={styles.tabbar}>
      <Animated.View style={[animatedStyle,{ //style the blue button which moves when user changes tab
          position: 'absolute',
          backgroundColor: '#47B5FF',
          borderRadius: 30,
          marginHorizontal: 12,
          height: dimensions.height - 15,
          width: buttonWidth - 25
        }]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          if (buttonWidth > 0) {
            tabPositionX.value = withSpring(buttonWidth * index, { duration: 1500 }); // animate the button moving position with a spring effect
          }
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
        
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            label={label}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 10,
    shadowOpacity: 0.2
  }
})