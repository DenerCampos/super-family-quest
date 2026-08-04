/** Mapa pathname → contexto enviado ao assistente + chave de exemplos/rótulo i18n. */
const ROUTE_CONTEXT: Array<{
  match: RegExp;
  /** Texto descritivo para o prompt da API (PT). */
  context: string;
  /** Chave em `chatAssistant.examples.*` e `chatAssistant.contexts.*`. */
  examplesKey: string;
}> = [
  { match: /^\/expense/, context: 'despesas', examplesKey: 'expenses' },
  { match: /^\/revenue/, context: 'receitas financeiras', examplesKey: 'revenues' },
  { match: /^\/dashboard/, context: 'relatórios', examplesKey: 'reports' },
  {
    match: /^\/new-resources\/shopping/,
    context: 'lista de compras',
    examplesKey: 'shopping',
  },
  {
    match: /^\/new-resources\/family/,
    context: 'grupo familiar',
    examplesKey: 'family',
  },
  {
    match: /^\/new-resources\/recipes/,
    context: 'receitas culinárias',
    examplesKey: 'recipes',
  },
  {
    match: /^\/new-resources\/quests/,
    context: 'tarefas e mesada',
    examplesKey: 'chores',
  },
  {
    match: /^\/new-resources\/health\/prescriptions/,
    context: 'receituário médico',
    examplesKey: 'prescriptions',
  },
  {
    match: /^\/new-resources\/health/,
    context: 'saúde',
    examplesKey: 'health',
  },
  { match: /^\/new-challenge/, context: 'missões', examplesKey: 'missions' },
  { match: /^\/profile/, context: 'perfil', examplesKey: 'profile' },
  { match: /^\/settings/, context: 'perfil', examplesKey: 'profile' },
  { match: /^\/(home)?$/, context: 'início', examplesKey: 'home' },
];

export function resolveChatScreenContext(pathname: string): {
  context: string;
  examplesKey: string;
} {
  for (const row of ROUTE_CONTEXT) {
    if (row.match.test(pathname)) {
      return { context: row.context, examplesKey: row.examplesKey };
    }
  }
  return { context: 'geral', examplesKey: 'home' };
}
