import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { theme } = useTheme(); 
  const themeMode = theme.dark ? 'dark' : 'light'; 
  const colorFromProps = props[themeMode];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[themeMode][colorName];
  }
}
