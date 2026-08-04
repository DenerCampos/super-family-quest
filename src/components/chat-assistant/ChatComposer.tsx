import { Button, Flex, Input, Wrap, WrapItem } from '@chakra-ui/react';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';

type ChatComposerProps = {
  input: string;
  onInputChange: (value: string) => void;
  onSend: (text?: string) => void;
  isSending: boolean;
  showExamples: boolean;
  examples: string[];
  panelBg: string;
  panelSurface: string;
  borderColor: string;
  bodyColor: string;
  muted: string;
  inputBg: string;
  primaryBg: string;
  primaryText: string;
};

export function ChatComposer({
  input,
  onInputChange,
  onSend,
  isSending,
  showExamples,
  examples,
  panelBg,
  panelSurface,
  borderColor,
  bodyColor,
  muted,
  inputBg,
  primaryBg,
  primaryText,
}: ChatComposerProps) {
  const { t } = useThemedTranslation();

  return (
    <>
      {showExamples && examples.length > 0 && (
        <Wrap px={3} pb={2} spacing={2} bg={panelBg}>
          {examples.map((ex) => (
            <WrapItem key={ex}>
              <Button
                size="xs"
                variant="outline"
                borderColor={borderColor}
                color={bodyColor}
                bg={panelBg}
                onClick={() => onSend(ex)}
                isDisabled={isSending}
              >
                {ex}
              </Button>
            </WrapItem>
          ))}
        </Wrap>
      )}

      <Flex
        gap={2}
        px={3}
        py={2}
        bg={panelSurface}
        borderTopWidth="1px"
        borderColor={borderColor}
      >
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={t('chatAssistant.placeholder')}
          size="sm"
          bg={inputBg}
          color={bodyColor}
          borderColor={borderColor}
          _placeholder={{ color: muted }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSend();
          }}
        />
        <Button
          size="sm"
          bg={primaryBg}
          color={primaryText}
          onClick={() => onSend()}
          isLoading={isSending}
          isDisabled={!input.trim()}
        >
          {t('chatAssistant.send')}
        </Button>
      </Flex>
    </>
  );
}
