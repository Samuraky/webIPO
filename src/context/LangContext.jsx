import { createContext, useContext, useState } from 'react';

export const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState('CAT');
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
