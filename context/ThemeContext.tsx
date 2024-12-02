import { createContext } from 'react';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

type ThemeContextType = {
  theme: typeof DefaultTheme; 
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);
