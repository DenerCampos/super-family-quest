import { useMemo, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { useChatAgent } from '../../hooks/useChatAgent';
import { useChatFabDrag } from '../../hooks/useChatFabDrag';
import { resolveChatScreenContext } from '../../utils/chatScreenContext';
import { TOAST_BOTTOM_OFFSET } from '../../theme/theme';
import { ChatFab } from './ChatFab';
import { ChatPanel } from './ChatPanel';

/** Próximo à borda direita do shell (acima do item Grimório / perfil). */
const FAB_RIGHT_PAD = 12;
/** Extra acima da NavigationBar (TOAST_BOTTOM_OFFSET). */
const FAB_BOTTOM_EXTRA = 20;
const PANEL_Z = 40;
const FAB_Z = 35;

export function ChatAssistantWidget() {
  const location = useLocation();
  const shellRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const screen = useMemo(
    () => resolveChatScreenContext(location.pathname),
    [location.pathname],
  );

  const navClearance = parseInt(TOAST_BOTTOM_OFFSET, 10) || 72;
  const defaultBottom = navClearance + FAB_BOTTOM_EXTRA;

  const chat = useChatAgent({
    open,
    screenContext: screen.context,
  });

  const fab = useChatFabDrag({
    defaultRight: FAB_RIGHT_PAD,
    defaultBottom,
    shellRef,
    onClick: () => setOpen((v) => !v),
  });

  return (
    <Box
      ref={shellRef}
      position="fixed"
      left="50%"
      transform="translateX(-50%)"
      w="100%"
      maxW="480px"
      h="100vh"
      top={0}
      pointerEvents="none"
      zIndex={FAB_Z}
    >
      {!open && (
        <ChatFab
          size={fab.fabSize}
          right={fab.fabPos.right}
          bottom={fab.fabPos.bottom}
          zIndex={FAB_Z}
          onPointerDown={fab.onPointerDown}
          onPointerMove={fab.onPointerMove}
          onPointerUp={fab.onPointerUp}
        />
      )}

      {open && (
        <ChatPanel
          zIndex={PANEL_Z}
          bottomOffset={navClearance + 8}
          examplesKey={screen.examplesKey}
          sessionId={chat.sessionId}
          messages={chat.messages}
          isResumingSession={chat.isResumingSession}
          isLoadingMessages={chat.isLoadingMessages}
          isFetchingNextPage={chat.isFetchingNextPage}
          hasNextPage={!!chat.hasNextPage}
          fetchNextPage={() => {
            void chat.fetchNextPage();
          }}
          isSending={chat.isSending}
          errorMsg={chat.errorMsg}
          onSend={chat.sendMessage}
          onClose={() => setOpen(false)}
        />
      )}
    </Box>
  );
}
