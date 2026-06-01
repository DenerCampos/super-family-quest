import { PageScaffold } from '../../components/PageScaffold';
import { useVisualTheme } from '../../hooks/useVisualTheme';

type ChallengePageScaffoldProps = {
  title: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  contentLayout?: 'singleCard' | 'plain';
  backTo?: string;
  hideBack?: boolean;
};

export const ChallengePageScaffold = ({
  title,
  children,
  isLoading = false,
  contentLayout = 'singleCard',
  backTo = '/new-resources/quests',
  hideBack = false,
}: ChallengePageScaffoldProps) => {
  const { getColor } = useVisualTheme();

  return (
    <PageScaffold
      title={title}
      backTo={backTo}
      hideBack={hideBack}
      isLoading={isLoading}
      contentLayout={contentLayout}
      bg={getColor('background.resources')}
    >
      {children}
    </PageScaffold>
  );
};
