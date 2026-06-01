import { Flex, Text } from '@chakra-ui/react';
import { BackButton } from './BackButton';
import { useVisualTheme } from '../hooks/useVisualTheme';

type PageTitleBarProps = {
  title: string;
  backTo?: string;
  hideBack?: boolean;
  titleRight?: React.ReactNode;
};

export const PageTitleBar = ({
  title,
  backTo,
  hideBack = false,
  titleRight,
}: PageTitleBarProps) => {
  const { getColor, getFont } = useVisualTheme();

  return (
    <Flex
      align="center"
      px={3}
      py={2}
      gap={2}
      flexShrink={0}
      bg={getColor('background.familyGroup.card')}
      borderBottomWidth="1px"
      borderColor={getColor('border.familyGroup.card')}
    >
      {!hideBack && backTo && <BackButton to={backTo} />}
      <Text
        flex={1}
        fontWeight="bold"
        fontFamily={getFont('heading')}
        fontSize="md"
        color={getColor('text.dashboard.title')}
        noOfLines={1}
      >
        {title}
      </Text>
      {titleRight}
    </Flex>
  );
};
