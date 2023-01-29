import React, { createContext, useCallback, useContext, useState } from "react";

export type CountContextType = {
  count: number;
  setCount?: (count: number) => void;
};

const initialContext: CountContextType = {
  count: 0,
};

const CountContext = createContext<CountContextType>(initialContext);

const CountContextProvider = CountContext.Provider;

export const useCountContext = (): CountContextType => {
  return useContext(CountContext);
};

export type CountProviderProps = {
  children: React.ReactNode;
};

const CountProvider = ({ children }: CountProviderProps) => {
  const { count } = useCountContext();
  const [locaLCount, setLocalCount] = useState<number>(count);

  const handleSetCount = useCallback((newCount: number) => {
    setLocalCount((prevCount) => prevCount + newCount);
  }, []);

  return (
    <CountContextProvider
      value={{ count: locaLCount, setCount: handleSetCount }}
    >
      {children}
    </CountContextProvider>
  );
};

export default CountProvider;
