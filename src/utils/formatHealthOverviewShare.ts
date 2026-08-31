import type { TFunction } from 'i18next';
import type { HealthAiOverviewDto } from '../types/health';
import { formatAppDateTime } from './formatDate';
import type { ShareTextPayload } from './nativeShare';

export function formatHealthOverviewShare(
  overview: HealthAiOverviewDto,
  t: TFunction,
): ShareTextPayload {
  const title = t('share.healthOverview.title');
  const memberName =
    overview.user?.name?.trim() || t('reports.healthReports.unknownMember');
  const content =
    overview.reportContent?.trim() || t('share.healthOverview.empty');

  const lines = [
    title,
    t('share.healthOverview.member', { name: memberName }),
    t('share.healthOverview.generatedAt', {
      date: formatAppDateTime(overview.generatedAt),
    }),
    '',
    content,
    '',
    t('health.overview.disclaimer'),
  ];

  return {
    title,
    text: lines.join('\n'),
  };
}
