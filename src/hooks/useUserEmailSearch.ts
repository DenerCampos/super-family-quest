import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../services';
import type { UserSearchItem } from '../services/user';

const SEARCH_MIN_CHARS = 3;
const SEARCH_DEBOUNCE_MS = 300;

export function useUserEmailSearch(enabled = true) {
  const [email, setEmail] = useState('');
  const [suggestions, setSuggestions] = useState<UserSearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchSeqRef = useRef(0);

  const clearSearch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setEmail('');
    setSuggestions([]);
    setShowSuggestions(false);
    setIsSearching(false);
  }, []);

  useEffect(() => {
    if (!enabled) clearSearch();
  }, [enabled, clearSearch]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const runSearch = useCallback(async (query: string) => {
    const seq = ++searchSeqRef.current;
    setIsSearching(true);
    try {
      const results = await api.searchUsersByEmail(query);
      if (seq !== searchSeqRef.current) return;
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch {
      if (seq !== searchSeqRef.current) return;
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      if (seq === searchSeqRef.current) {
        setIsSearching(false);
      }
    }
  }, []);

  const handleEmailChange = useCallback(
    (value: string) => {
      setEmail(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      const trimmed = value.trim();
      if (trimmed.length < SEARCH_MIN_CHARS) {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsSearching(false);
        return;
      }

      debounceRef.current = setTimeout(() => {
        void runSearch(trimmed);
      }, SEARCH_DEBOUNCE_MS);
    },
    [runSearch],
  );

  const selectSuggestion = useCallback((user: UserSearchItem) => {
    setEmail(user.email);
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  const revealSuggestions = useCallback(() => {
    if (suggestions.length > 0) setShowSuggestions(true);
  }, [suggestions.length]);

  return {
    email,
    suggestions,
    isSearching,
    showSuggestions,
    handleEmailChange,
    selectSuggestion,
    revealSuggestions,
    clearSearch,
    setShowSuggestions,
  };
}
