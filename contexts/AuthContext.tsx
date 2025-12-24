import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface UserData {
  userId: string;
  userType: 'Customer' | 'Employee';
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  userData: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserData: (data: UserData | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const STORAGE_KEYS = {
  USER_DATA: '@auth_user_data',
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from AsyncStorage on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (storedData) {
        setUserData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phoneNumber: string, password: string) => {
    try {
      const response = await fetch(
        'https://cleanservice.app/api/auth/login/mobile',
        {
          method: 'POST',
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber,
            password,
          }),
        },
      );

      // Parse response
      const text = await response.text();
      let result;

      console.log('Login response text:', text);

      try {
        result = JSON.parse(text);
      } catch (e) {
        // Nếu không parse được JSON, có thể server trả về lỗi khác
        if (!response.ok) {
          throw new Error('Invalid phone number or password');
        }
        throw new Error('Server error. Please try again');
      }

      // Kiểm tra status code
      if (!response.ok || result.statusCode !== 200) {
        throw new Error(result.message || 'Invalid phone number or password');
      }

      if (result.data) {
        const authData: UserData = {
          userId: result.data.userId,
          userType: result.data.userType,
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        };

        // Save to state
        setUserData(authData);

        // Persist to AsyncStorage
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(authData),
        );
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear state
      setUserData(null);

      // Clear AsyncStorage
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const isAuthenticated = userData !== null;

  return (
    <AuthContext.Provider
      value={{
        userData,
        isAuthenticated,
        isLoading,
        login,
        logout,
        setUserData,
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
