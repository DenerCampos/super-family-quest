import { useVisualTheme } from './useVisualTheme';
import { resolveChakraColor } from '../utils/resolveColor';

/** Tokens de cor do painel do Assistente Familiar. */
export function useChatPanelColors() {
  const { getColor } = useVisualTheme();

  return {
    panelBg: resolveChakraColor(getColor('background.dashboard.tile')),
    panelSurface: resolveChakraColor(getColor('background.home')),
    headerBg: resolveChakraColor(getColor('background.header')),
    borderColor: resolveChakraColor(getColor('input.border')),
    titleColor: resolveChakraColor(getColor('text.lastRegistrations.title')),
    bodyColor: resolveChakraColor(getColor('text.lastRegistrations.primary')),
    muted: resolveChakraColor(getColor('text.lastRegistrations.neutral')),
    errorColor: resolveChakraColor(getColor('status.error')),
    userBubble: resolveChakraColor(getColor('button.background.primary')),
    primaryText: resolveChakraColor(getColor('button.text.primary')),
    assistantBubble: resolveChakraColor(getColor('background.noSelect')),
    inputBg: resolveChakraColor(getColor('background.dashboard.tile')),
    primaryBg: resolveChakraColor(getColor('button.background.primary')),
  };
}
