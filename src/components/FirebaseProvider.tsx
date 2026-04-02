import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, onAuthStateChanged, User, db, doc, getDoc, onSnapshot } from '@/firebase';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  isAdmin: false,
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let unsubSettings: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      // Cleanup previous settings listener if it exists
      if (unsubSettings) {
        unsubSettings();
        unsubSettings = null;
      }

      if (user) {
        try {
          // First check if user is admin in users collection (fixed role)
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            setIsAdmin(true);
            setLoading(false);
          } else {
            // Real-time listener for site settings to check authorized emails
            unsubSettings = onSnapshot(doc(db, 'site', 'settings'), (settingsSnap) => {
              const authorizedEmails = settingsSnap.exists() ? settingsSnap.data().authorizedEmails || [] : [];
              if (user.email === "wooji385@gmail.com" || authorizedEmails.includes(user.email)) {
                setIsAdmin(true);
              } else {
                setIsAdmin(false);
              }
              setLoading(false);
            }, (error) => {
              console.error("Error checking admin status in settings:", error);
              setIsAdmin(user.email === "wooji385@gmail.com");
              setLoading(false);
            });
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(user.email === "wooji385@gmail.com");
          setLoading(false);
        }
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubSettings) unsubSettings();
    };
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </FirebaseContext.Provider>
  );
};
