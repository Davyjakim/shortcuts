import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Helper to read localStorage safely
  const readValue = (): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // CRITICAL: Dispatch a custom event to notify other components in THIS window
        window.dispatchEvent(new Event("local-storage"));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent | Event) => {
      // 1. Handle "storage" event (Cross-tab synchronization)
      // We only care if the specific key we are watching has changed
      if (event.type === 'storage' && (event as StorageEvent).key !== key) {
        return;
      }

      // 2. Handle "local-storage" event (Same-window synchronization)
      // If we are here, it means the key changed (either via cross-tab or same-window)
      // So we re-read the value from storage.
      setStoredValue(readValue());
    };

    // Listen for changes in other tabs/windows
    window.addEventListener("storage", handleStorageChange);
    
    // Listen for changes in the CURRENT window (triggered by our custom dispatch above)
    window.addEventListener("local-storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [storedValue, setValue] as const;
}