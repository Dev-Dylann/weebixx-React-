import { createContext, useState } from "react";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [placeholder] = useState("Holding");
  return (
    <DataContext.Provider
      value={{
        placeholder,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
