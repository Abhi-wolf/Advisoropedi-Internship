import { createContext, useContext, useState } from "react";

// create the theme context
const ThemeContext = createContext();

//  create a custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// create the theme provider component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
