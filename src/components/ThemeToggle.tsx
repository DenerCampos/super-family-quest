import { Button, useToast } from '@chakra-ui/react';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeNamespace } from '../i18n/types';
import { useThemedTranslation } from '../hooks/useThemedTranslation';

export function ThemeToggle() {
  const { currentTheme, changeTheme } = useTheme();
  const { t } = useThemedTranslation();
  const toast = useToast();

  const handleThemeChange = () => {
    const newTheme: ThemeNamespace = currentTheme === 'default' ? 'rpg' : 'default';
    changeTheme(newTheme);

    toast({
      title: t('common.success'),
      description: t('profile.themeChanged'),
      status: 'success',
      duration: 3000,
    });
  };

  return (
    <Button
      onClick={handleThemeChange}
      colorScheme="purple"
      variant="outline"
      size="sm"
    >
      {t('header.themeToggle.' + (currentTheme === 'default' ? 'rpgMode' : 'defaultMode'))}
    </Button>
  );
} 