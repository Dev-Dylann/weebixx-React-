import { createContext, useState } from "react";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);


  return (
    <DataContext.Provider
      value={{
        isDark, setIsDark,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
