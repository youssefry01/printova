"use client";

import { createContext, useEffect, useState, FC, ReactNode } from "react";
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;

    const saved = localStorage.getItem("darkTheme");

    return saved ? JSON.parse(saved) : false;
  });

  const toggleTheme = () => setIsDark(prev => !prev);

  useEffect(() => {
    localStorage.setItem("darkTheme", JSON.stringify(isDark));

    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
