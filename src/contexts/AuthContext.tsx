import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithRedirect, 
  getRedirectResult,
  signOut 
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthUser {
  email: string;
  username: string;
  photoURL?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to sync user with our DB
  const syncUserWithDB = async (email: string, username: string) => {
    try {
      await fetch('/api/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username }),
      });
    } catch (err) {
      console.error("[AUTH] DB Sync error:", err);
    }
  };

  useEffect(() => {
    // 1. Monitor Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser?.email) {
        const userData: AuthUser = {
          email: currentUser.email,
          username: currentUser.displayName || currentUser.email.split('@')[0],
          photoURL: currentUser.photoURL || undefined
        };
        setUser(userData);
        await syncUserWithDB(userData.email, userData.username);
      } else {
        // 2. If no Firebase user, try auto-login by IP from our DB
        try {
          const res = await fetch('/api/me-by-ip');
          const data = await res.json();
          if (data.user) {
            setUser({
              email: data.user.email,
              username: data.user.username
            });
          } else {
            setUser(null);
          }
        } catch (err) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    // 3. Handle redirect result
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user?.email) {
          const userData: AuthUser = {
            email: result.user.email,
            username: result.user.displayName || result.user.email.split('@')[0],
            photoURL: result.user.photoURL || undefined
          };
          setUser(userData);
          await syncUserWithDB(userData.email, userData.username);
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
