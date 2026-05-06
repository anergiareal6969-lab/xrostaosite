import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithRedirect, 
  getRedirectResult,
  signOut 
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Monitor auth state changes (standard way)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("[AUTH] State change:", currentUser?.email);
      setUser(currentUser);
      setLoading(false);
    });

    // 2. Force check for redirect result on every mount
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log("[AUTH] Redirect success:", result.user.email);
          setUser(result.user);
        }
      } catch (error: any) {
        console.error("[AUTH] Redirect error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkRedirect();

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      setLoading(false);
      console.error("[AUTH] Login start error:", error);
      alert(`Σφάλμα σύνδεσης: ${error.message}`);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
