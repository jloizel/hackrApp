import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

export type RouteName = 'index' | 'calendar' | 'profile';

export const icons: { [key in RouteName]: (props: any) => JSX.Element } = {
  index: (props: any) => <MaterialCommunityIcons name="puzzle-outline" size={22} {...props}/>,
  calendar: (props: any) => <AntDesign name="calendar" size={22} {...props}/>,
  // profile: (props: any) => <AntDesign name="user" size={22} {...props}/>,
  profile: (props: any) => <MaterialCommunityIcons name="face-man-profile" size={22} {...props}/>,
}