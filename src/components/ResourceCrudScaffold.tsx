import { PageScaffold } from './PageScaffold';
import { useVisualTheme } from '../hooks/useVisualTheme';

type ResourceCrudScaffoldProps = Omit<
  React.ComponentProps<typeof PageScaffold>,
  'contentLayout'
> & {
  contentPt?: number;
};

/**
 * CRUD de recursos: cartão com borda (como Nova tarefa), título fixo e scroll no miolo.
 * Não usar em modais, /expense, /revenue nem perfil.
 */
export const ResourceCrudScaffold = ({
  bg,
  contentPt = 4,
  ...props
}: ResourceCrudScaffoldProps) => {
  const { getColor } = useVisualTheme();

  return (
    <PageScaffold
      contentLayout="singleCard"
      contentPt={contentPt}
      bg={bg ?? getColor('background.resources')}
      {...props}
    />
  );
};
