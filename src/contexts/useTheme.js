import { useContext } from 'react';
import ThemeContext from './ThemeContextInstance';

const useTheme = () => useContext(ThemeContext);
export default useTheme; 