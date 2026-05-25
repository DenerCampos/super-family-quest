export const missionQueryKeys = {
  root: ['missions'] as const,
  list: () => [...missionQueryKeys.root, 'list'] as const,
};
