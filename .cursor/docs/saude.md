# Módulo de Saúde — SP-123

## Objetivo

Permitir que membros de um grupo familiar cadastrem, organizem e visualizem exames médicos, receituários e obtenham um relatório de saúde gerado por IA (Gemini), com suporte a upload de PDFs e imagens.

---

## Escopo

**Inclui:**
- Cadastro manual de exames (laboratorial, imagem, funcional, procedimento)
- Upload de PDFs e imagens de exames para processamento automático via IA
- Revisão e aprovação dos dados extraídos pela IA antes de salvar
- Busca de exames com filtros (nome, médico, laboratório, data, tipo) + gráfico de evolução
- Visão geral de saúde gerada por Gemini (relatório em cache, regenerável)
- Cadastro, listagem e detalhe de receituários com horários e agendamento estruturado
- Permissões familiares: admin gerencia qualquer membro; membros gerenciam apenas os seus

**Não inclui (versão inicial):**
- Prontuário completo / histórico médico geral
- Agendamento de consultas
- Integração com planos de saúde
- Notificações de medicamentos (push)

---

## Fluxo

### Cadastro Manual
1. Usuário acessa `/new-resources/health/register`
2. Seleciona aba "Manual"
3. Preenche tipo, laboratório, médico, data, itens (resultados ou laudo)
4. Salva → POST `/health/exams` → exame com status `APPROVED`

### Upload de PDF/Imagem
1. Usuário seleciona aba "PDF/Imagem"
2. Seleciona múltiplos arquivos (PDF, JPG, PNG — máx. **10 MB** por arquivo, validado no cliente)
3. Clica em "Enviar ao Processamento" → POST `/health/upload` (multipart: `files` + opcional `targetUserId` no body)
4. API salva arquivo no Supabase Storage (pasta `health/`) e cria registro em `health_exam_processing` com status `QUEUED`
5. Cron job (`*/2 * * * *`) processa até 3 arquivos por vez (QUEUED + FAILED elegíveis após **2 horas**):
   - PDF com texto extraível → `pdf-parse` + prompt laboratorial para Gemini
   - PDF com imagens / arquivo de imagem → envia base64 + prompt de laudo para Gemini
6. Registro atualizado para `COMPLETED` com dados em `extractedData`
7. Usuário acessa `/new-resources/health/pending`, vê lista de arquivos com status `COMPLETED`
8. Clica no item → `/new-resources/health/pending/:id` → revisa dados extraídos, edita se necessário
9. Salva → POST `/health/processing/:id/approve` → cria `health_exam` com itens + arquivo vinculado, remove processamento

### Busca
- `/new-resources/health/search` com filtros independentes
- Resultado em lista expansível; item anormal com badge laranja
- Botão "Ver evolução" exibe `LineChart` (Recharts) com histórico do primeiro item laboratorial

### Visão Geral (IA)
1. Usuário acessa `/new-resources/health/overview`
2. Seleciona membro (se admin)
3. (Opcional) Preenche campo de **informações adicionais** sobre o paciente — sintomas, relatos de consultas, doenças conhecidas/suspeitas
4. Clica "Gerar Relatório" → POST `/health/ai-overview` com `{ targetUserId?, patientContext? }`
5. Se `patientContext` informado, salvo em `health_patient_context` (histórico com data)
6. **Geração incremental:**
   - **1º relatório**: envia **tudo** (todos os exames + todo o contexto + último receituário).
   - **2º em diante**: envia só o **novo desde o último relatório** (exames/contextos após `generatedAt`) + **último receituário** + **relatório anterior** para consolidação.
   - Sem exames/contextos/receituário novos → **não gera**, apenas mostra o último relatório.
7. Gemini gera relatório em Markdown (incl. seção de medicamentos)
8. Resultado salvo em `health_ai_overview`
9. Próximas visitas carregam do cache via GET `/health/ai-overview/latest`. Na tela, o **"Histórico de informações"** e o **"Último relatório gerado"** ficam **colapsados** por padrão (expansíveis); o relatório aparece **logo após** o histórico, antes do botão de gerar/regenerar.

### Relatórios de Saúde (dashboard)
1. Tile **"Relatórios de Saúde"** no dashboard → `/dashboard/healthReports`
2. Filtros iguais aos demais cards: membro (`UserFamilyFilter`: "Família Inteira"/membro), mês, ano e período personalizado
3. Lista os relatórios de `health_ai_overview` do período via GET `/health/ai-overview` (por membro ou família toda), ordenados do mais recente
4. Tocar um item abre `/dashboard/health-report/:overviewId` (tela de detalhe) → GET `/health/ai-overview/:id` → conteúdo em Markdown (`HealthMarkdownContent`)

### Receituário
- Listagem: GET `/health/prescriptions` com filtro por membro
- Novo: formulário com médico, data, itens (medicamento, dosagem, horários, dias da semana, datas início/fim)
- **Análise com IA (novo):** no topo de `/new-resources/health/prescriptions/new`, usuário pode tirar foto, escolher da galeria ou enviar PDF → POST `/health/prescriptions/analyze` → IA preenche o formulário para revisão e salvamento
- Detalhe: exibe medicamentos com status (em uso / concluído)
- Edição e exclusão disponíveis

---

## Contratos HTTP

### Exames
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/health/exams` | Cadastro manual |
| GET | `/health/exams` | Listagem com filtros |
| GET | `/health/exams/:id` | Detalhe |
| PUT | `/health/exams/:id` | Atualização |
| DELETE | `/health/exams/:id` | Exclusão (soft delete) |

### Upload / Processamento
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/health/upload` | Upload multipart (`files`; `targetUserId` opcional no body ou query legado) |
| GET | `/health/processing` | Lista processamentos (todos os status) |
| GET | `/health/processing/:id` | Detalhe |
| POST | `/health/processing/:id/approve` | Aprovar e criar exame |
| POST | `/health/processing/:id/retry` | Reprocessar imediatamente um item `FAILED` |
| DELETE | `/health/processing/:id` | Descartar |

### Visão Geral
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health/patient-context?targetUserId=` | Histórico de informações adicionais do paciente |
| GET | `/health/patient-context/latest?targetUserId=` | Última descrição registrada do paciente |
| POST | `/health/patient-context` | Registrar descrição ("como estou me sentindo agora") sem gerar relatório |
| POST | `/health/ai-overview` | Gerar relatório (`patientContext` opcional) |
| GET | `/health/ai-overview/latest` | Última geração (cache) |
| GET | `/health/ai-overview?targetUserId=&startDate=&endDate=` | Listar relatórios por membro/família e período (card "Relatórios de Saúde" no dashboard) |
| GET | `/health/ai-overview/:id` | Detalhe de um relatório (tela aberta ao tocar um item do card) |

### Receituário
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/health/prescriptions/analyze` | Analisar foto/PDF de receita com IA (multipart `file`) |
| POST | `/health/prescriptions` | Criar receituário |
| GET | `/health/prescriptions` | Listar com filtro |
| GET | `/health/prescriptions/:id` | Detalhe |
| PUT | `/health/prescriptions/:id` | Atualizar |
| DELETE | `/health/prescriptions/:id` | Excluir |

---

## Regras de Negócio

### Permissões
- **Admin**: cria, edita e exclui exames/receituários de qualquer membro do grupo; visualiza tudo
- **Membro**: cria, edita e exclui apenas os próprios exames/receituários; pode visualizar e buscar exames de toda a família; pode visualizar o relatório IA de qualquer membro

### Processamento IA
- PDF com texto legível → extração via `pdf-parse` + prompt laboratorial (sem limite de páginas)
- PDF sem texto / imagem → envio do base64 ao Gemini com prompt de laudo de imagem
- Máx. 3 arquivos por execução do cron (a cada 2 min)
- Falhas registradas com `errorMessage`, `failedAt` e `retryCount`; status `FAILED` visível na fila de pendentes
- **Retry automático:** após **2 horas** (`HEALTH_PROCESSING_AUTO_RETRY_AFTER_MS` na API; espelhada em `src/utils/healthProcessingConstants.ts` no app)
- **Retry manual:** botão **Tentar novamente** em cards `FAILED` → `POST /health/processing/:id/retry`
- Mensagem dinâmica no card: countdown até o próximo retry automático (`formatAutoRetryRemaining` em `healthProcessingRetry.ts`)

### Exames
- `sourceType`: `MANUAL` = cadastro direto; `PDF`/`IMAGE_FILE` = via upload
- `status`: `PENDING_REVIEW` = em processamento; `APPROVED` = disponível para busca
- `examType`: classificado pela IA (upload) ou pelo usuário (manual)
- Exclusão faz `softDelete` e remove arquivo do Supabase Storage

### Receituário
- `daysOfWeek = null` → todos os dias
- `endDate = null` → uso contínuo (medicamento em uso)
- `scheduleTimes` → array de strings `"HH:mm"` para agendamento

---

## Arquivos-chave

### API (`api/shop-smart`)
| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/health/health.module.ts` | Módulo NestJS |
| `src/health/health.controller.ts` | Rotas HTTP |
| `src/health/health.service.ts` | Lógica de negócio, permissões |
| `src/health/health-ai.provider.ts` | Prompts Gemini (laboratorial, imagem, visão geral) |
| `src/health/health-processing.scheduler.ts` | Cron `*/2 * * * *` |
| `src/health/entities/` | 7 entidades TypeORM |
| `src/health/dto/` | DTOs de entrada/filtro |
| `db/migrations/1775300000000-AddHealthTables.ts` | Migration inicial (7 tabelas) |
| `db/migrations/1775400000000-AddHealthPatientContext.ts` | Migration histórico de contexto do paciente |
| `src/health/entities/health-patient-context.entity.ts` | Entidade do histórico |
| `src/health/repositories/health-patient-context.repository.ts` | Repositório do histórico |

### App (`app/super-family-quest`)
| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/pages/NewHealth/index.tsx` | Hub de tiles (1º tile: "Como estou me sentindo agora") |
| `src/pages/NewHealth/HealthFeelingNowView.tsx` | Tela "como estou me sentindo agora": input + seletor de membro + card da última descrição |
| `src/pages/NewHealth/HealthRegisterView.tsx` | Cadastro manual + upload |
| `src/pages/NewHealth/HealthProcessingList.tsx` | Lista de processamentos (incl. retry manual e mensagem de auto-retry) |
| `src/pages/NewHealth/HealthPendingView.tsx` | Lista de pendentes (abas) |
| `src/utils/healthProcessingConstants.ts` | Constante de intervalo de retry (2 h) |
| `src/utils/healthProcessingRetry.ts` | Texto/countdown do próximo retry automático |
| `src/pages/NewHealth/HealthPendingDetailView.tsx` | Revisão / aprovação de IA |
| `src/pages/NewHealth/HealthSearchView.tsx` | Busca de exames + gráfico |
| `src/pages/NewHealth/HealthOverviewView.tsx` | Relatório IA (histórico + último relatório colapsados) |
| `src/components/reports/HealthReportsPanel.tsx` | Card "Relatórios de Saúde" do dashboard (lista por membro/período) |
| `src/pages/Dashboard/HealthReportDetailView.tsx` | Tela de detalhe de um relatório (rota `/dashboard/health-report/:overviewId`) |
| `src/pages/NewHealth/HealthPrescriptionsView.tsx` | Lista receituários |
| `src/pages/NewHealth/HealthPrescriptionFormView.tsx` | Formulário receituário |
| `src/pages/NewHealth/HealthPrescriptionDetailView.tsx` | Detalhe receituário |
| `src/services/health.ts` | Chamadas HTTP |
| `src/hooks/useHealthExams.ts` | React Query exames + upload |
| `src/hooks/useHealthExamRegisterForm.ts` | RHF + Yup cadastro manual |
| `src/hooks/useHealthPendingReviewForm.ts` | RHF + Yup revisão de processados |
| `src/hooks/useHealthPrescriptionForm.ts` | RHF + Yup receituário |
| `src/utils/healthConstants.ts` | Tipos de exame, dias da semana, cores de status |
| `src/utils/healthUpload.ts` | Validação de upload (tipo + 10 MB) |
| `src/hooks/useHealthOverview.ts` | React Query visão geral |
| `src/hooks/useHealthPrescriptions.ts` | React Query receituário |
| `src/types/health.ts` | Tipos TypeScript |

---

## Testes

### Unitários (API)
- `HealthService.createExam` → permissão admin/membro, salvar com itens
- `HealthService.approveProcessing` → criar exame a partir de dados extraídos
- `HealthService.assertCanWrite` → membro não pode editar dados de outro
- `HealthAiProvider.parseJson` → erro em JSON inválido

### E2E (API)
```bash
npm run test:e2e:low-mem -- --testPathPattern=health
```
- POST `/health/exams` → 201 com itens
- GET `/health/exams?examName=Ureia` → 200 filtrado
- POST `/health/upload` → 201 com processamento QUEUED
- POST `/health/processing/:id/approve` → 201 com exame criado
- POST `/health/ai-overview` → 201 com relatório
- POST `/health/prescriptions` → 201 com itens
- 403 membro tentando editar exame de outro membro

### Frontend
- HealthRegisterView: preencher form + submit → mutation chamada
- HealthPendingView: lista items com status badges
- HealthOverviewView: exibe relatório em cache; "Regenerar" chama mutation
