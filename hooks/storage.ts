import { Bookmark } from '@/types';

const STORAGE_KEY = 'smart_bookmarks_data';

export const getStoredBookmarks = (): Bookmark[] => {
  if (typeof window === 'undefined') return [];
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error('Failed to load bookmarks', error);
    return [];
  }
};

export const saveStoredBookmarks = (bookmarks: Bookmark[]): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Failed to save bookmarks', error);
  }
};
