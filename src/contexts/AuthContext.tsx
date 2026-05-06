import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup,
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
    console.log("[AUTH] Attempting to sync with DB:", email);
    try {
      const response = await fetch('/api/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username }),
      });
      const data = await response.json();
      console.log("[AUTH] DB Sync response:", data);
    } catch (err) {
      console.error("[AUTH] DB Sync error:", err);
    }
  };

  useEffect(() => {
    console.log("[AUTH] Provider initialized, checking state...");
    
    // 1. Monitor Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser?.email) {
        console.log("[AUTH] Firebase user found:", currentUser.email);
        const userData: AuthUser = {
          email: currentUser.email,
          username: currentUser.displayName || currentUser.email.split('@')[0],
          photoURL: currentUser.photoURL || undefined
        };
        setUser(userData);
        await syncUserWithDB(userData.email, userData.username);
      } else {
        console.log("[AUTH] No Firebase user, checking IP auto-login...");
        // 2. If no Firebase user, try auto-login by IP from our DB
        try {
          const res = await fetch('/api/me-by-ip');
          const data = await res.json();
          if (data.user) {
            console.log("[AUTH] IP Auto-login success:", data.user.email);
            setUser({
              email: data.user.email,
              username: data.user.username
            });
          } else {
            console.log("[AUTH] No IP record found.");
            setUser(null);
          }
        } catch (err) {
          console.error("[AUTH] IP lookup error:", err);
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    console.log("[AUTH] Login with Google started (Popup)...");
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      console.log("[AUTH] Popup success, user:", result.user.email);
      
      const userData: AuthUser = {
        email: result.user.email,
        username: result.user.displayName || result.user.email.split('@')[0],
        photoURL: result.user.photoURL || undefined
      };
      
      setUser(userData);
      await syncUserWithDB(userData.email, userData.username);
      console.log("[AUTH] Login flow completed.");
    } catch (error: any) {
      setLoading(false);
      console.error("[AUTH] Login error:", error);
      if (error.code === 'auth/popup-blocked') {
        alert("Το παράθυρο σύνδεσης μπλοκαρίστηκε. Παρακαλώ επέτρεψε τα pop-ups.");
      } else {
        alert(`Σφάλμα σύνδεσης: ${error.message}`);
      }
      throw error;
    } finally {
      setLoading(false);
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
