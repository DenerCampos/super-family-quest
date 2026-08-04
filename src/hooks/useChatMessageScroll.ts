import { useCallback, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types/chatAgent';

type UseChatMessageScrollOptions = {
  open: boolean;
  sessionKey: string | null;
  messages: ChatMessage[];
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isSending: boolean;
};

export function useChatMessageScroll({
  open,
  sessionKey,
  messages,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  isSending,
}: UseChatMessageScrollOptions) {
  const listRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const prevScrollHeightRef = useRef(0);

  const handleTopIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (
        entry?.isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        const el = listRef.current;
        prevScrollHeightRef.current = el?.scrollHeight ?? 0;
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const node = topSentinelRef.current;
    const root = listRef.current;
    if (!node || !root || !open) return;

    const observer = new IntersectionObserver(handleTopIntersect, {
      root,
      rootMargin: '80px',
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [handleTopIntersect, open, sessionKey, messages.length]);

  useEffect(() => {
    const el = listRef.current;
    if (!el || isFetchingNextPage) return;

    if (prevScrollHeightRef.current > 0) {
      el.scrollTop = el.scrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = 0;
      return;
    }

    if (stickToBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isFetchingNextPage, isSending]);

  const handleListScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottomRef.current = distanceFromBottom < 80;
  };

  const stickToBottom = () => {
    stickToBottomRef.current = true;
  };

  return {
    listRef,
    topSentinelRef,
    handleListScroll,
    stickToBottom,
  };
}
