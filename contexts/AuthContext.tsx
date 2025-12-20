import React, { createContext, ReactNode, useContext, useState } from 'react';

interface AuthContextType {
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  isAuthenticated: boolean;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Tạm thời hardcode userId, sau này sẽ lưu vào AsyncStorage
  const [authToken, setAuthToken] = useState<string | null>(
    'user_2np2lwmeO5VzPQTLKeaYgCFPhnF',
  );

  const isAuthenticated = authToken !== null;

  const login = (userId: string) => {
    setAuthToken(userId);
    // TODO: Lưu vào AsyncStorage khi tích hợp API
  };

  const logout = () => {
    setAuthToken(null);
    // TODO: Xóa khỏi AsyncStorage khi tích hợp API
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        setAuthToken,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
