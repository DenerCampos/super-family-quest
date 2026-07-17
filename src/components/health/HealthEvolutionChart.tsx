import { Box } from '@chakra-ui/react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { resolveChakraColor } from '../../utils/resolveColor';
import { formatAppDate } from '../../utils/formatDate';
import type { ParsedReferenceRange } from '../../utils/healthValue';

export interface EvolutionChartPoint {
  date: string;
  value: number;
  isAbnormal: boolean;
}

type Props = {
  data: EvolutionChartPoint[];
  unit?: string | null;
  reference?: ParsedReferenceRange | null;
  height?: number;
};

const compactNumber = (value: number): string => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(abs >= 10_000 ? 0 : 1)}k`;
  return String(value);
};

export const HealthEvolutionChart = ({
  data,
  unit,
  reference,
  height = 240,
}: Props) => {
  const { getColor } = useVisualTheme();

  const lineColor = resolveChakraColor(getColor('status.info'));
  const abnormalColor = resolveChakraColor(getColor('status.warning'));
  const gridColor = resolveChakraColor(getColor('border.familyGroup.card'));
  const axisColor = resolveChakraColor(getColor('text.dashboard.tileSubtitle'));
  const textPrimary = resolveChakraColor(getColor('text.dashboard.title'));
  const cardBg = resolveChakraColor(getColor('background.familyGroup.card'));
  const refBandColor = resolveChakraColor(getColor('status.success'));

  const hasReferenceBand =
    reference != null &&
    reference.min != null &&
    reference.max != null &&
    reference.min !== reference.max;

  return (
    <Box width="100%">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 16, bottom: 4, left: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) => formatAppDate(value)}
            tick={{ fontSize: 10, fill: axisColor }}
            minTickGap={16}
          />
          <YAxis
            tickFormatter={compactNumber}
            tick={{ fontSize: 10, fill: axisColor }}
            width={44}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              background: cardBg,
              border: `1px solid ${gridColor}`,
              borderRadius: 8,
            }}
            labelStyle={{ color: textPrimary, fontSize: 12 }}
            labelFormatter={(value: string) => formatAppDate(value)}
            formatter={(value: number) => [
              `${value}${unit ? ` ${unit}` : ''}`,
              '',
            ]}
          />
          {hasReferenceBand && reference ? (
            <ReferenceArea
              y1={reference.min ?? undefined}
              y2={reference.max ?? undefined}
              fill={refBandColor}
              fillOpacity={0.12}
              stroke={refBandColor}
              strokeOpacity={0.35}
            />
          ) : null}
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            dot={(props: {
              cx?: number;
              cy?: number;
              index?: number;
              payload?: EvolutionChartPoint;
            }) => {
              const { cx, cy, payload, index } = props;
              if (cx == null || cy == null) {
                return <g key={index} />;
              }
              return (
                <circle
                  key={index}
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={payload?.isAbnormal ? abnormalColor : lineColor}
                  stroke={cardBg}
                  strokeWidth={1}
                />
              );
            }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
