import React, { useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { ThemeContext } from './ThemeContext';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const systemTheme = Appearance.getColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');

  const toggleTheme = () => {
    setIsDarkMode((prevIsDarkMode) => !prevIsDarkMode);
  };

  const theme = isDarkMode ? DarkTheme : DefaultTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
