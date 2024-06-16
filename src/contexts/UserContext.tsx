import React, {createContext, ReactNode, useEffect, useState} from "react";

export interface UserContextType {
  name: string;
  success: boolean;
  setName:  React.Dispatch<React.SetStateAction<string>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextType | null>(null)

export const UserProvider = ({children}: { children: ReactNode}) => {
  const [name, setName] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    setName(localStorage.getItem("name") ?? "");

  }, [success]);

  const contextValue: UserContextType = {
    name,
    success,
    setName,
    setSuccess
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}
