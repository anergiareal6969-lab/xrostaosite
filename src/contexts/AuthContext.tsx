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
    // 1. First, set up the listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("[AUTH] State changed, user:", user?.email);
      setUser(user);
      setLoading(false);
    });

    // 2. Then, handle the redirect result specifically
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log("[AUTH] Redirect result found user:", result.user.email);
          setUser(result.user);
        }
      } catch (error: any) {
        console.error("[AUTH] Error handling redirect result:", error);
        // Only alert if it's a real error, not just "no result"
        if (error.code !== 'auth/no-current-user') {
          // alert(`Σφάλμα κατά την επιστροφή: ${error.message}`);
        }
      }
    };

    handleRedirect();

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      // Use Redirect instead of Popup to avoid "black screen" issues on mobile/browsers
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      console.error("Error starting redirect login:", error);
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
