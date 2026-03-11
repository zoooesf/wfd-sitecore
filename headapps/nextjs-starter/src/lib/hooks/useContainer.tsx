import React, { createContext, useContext } from 'react';

type ContainerProps = {
  children: React.ReactNode;
  containerName: string;
};

type ContainerContextType = {
  containerName: string;
};

const ContainerContext = createContext<ContainerContextType>({ containerName: '' });

export const ContainerProvider: React.FC<ContainerProps> = ({ children, containerName }) => {
  return (
    <ContainerContext.Provider value={{ containerName }}>{children}</ContainerContext.Provider>
  );
};

export const useContainer = () => {
  const context = useContext(ContainerContext);
  return context;
};
