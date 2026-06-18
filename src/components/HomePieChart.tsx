import { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type HomePieChartProps = {
  income: number;
  expenses: number;
  masked?: boolean;
  compact?: boolean;
  revenueColor: string;
  expenseColor: string;
  revenueLabelColor: string;
  expenseLabelColor: string;
  emptyFillColor: string;
  emptyLabelColor: string;
  strokeColor: string;
};

type SliceKey = 'income' | 'expenses';

type CenterOverlayProps = {
  compact: boolean;
  innerRadius: number;
  color: string;
  selectedSlice: SliceKey | null;
  sliceLabels: Record<SliceKey, string>;
  sliceShares: Record<SliceKey, number>;
  fallbackLabel: string;
};

function ChartCenterOverlay({
  compact,
  innerRadius,
  color,
  selectedSlice,
  sliceLabels,
  sliceShares,
  fallbackLabel,
}: CenterOverlayProps) {
  return (
    <Flex
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      direction="column"
      align="center"
      justify="center"
      pointerEvents="none"
      w={`${Math.max(innerRadius * 2 - 6, 36)}px`}
      textAlign="center"
      zIndex={1}
    >
      {selectedSlice ? (
        <>
          <Text
            fontSize={compact ? '8px' : '10px'}
            fontWeight="700"
            color={color}
            lineHeight="1.2"
            noOfLines={1}
          >
            {sliceLabels[selectedSlice]}:
          </Text>
          <Text
            fontSize={compact ? '11px' : '13px'}
            fontWeight="700"
            color={color}
            lineHeight="1.2"
          >
            {sliceShares[selectedSlice]}%
          </Text>
        </>
      ) : (
        <Text
          fontSize={compact ? '15px' : '17px'}
          fontWeight="700"
          color={color}
          lineHeight="1"
        >
          {fallbackLabel}
        </Text>
      )}
    </Flex>
  );
}

export const HomePieChart = ({
  income,
  expenses,
  masked,
  compact = false,
  revenueColor,
  expenseColor,
  revenueLabelColor,
  expenseLabelColor,
  emptyFillColor,
  emptyLabelColor,
  strokeColor,
}: HomePieChartProps) => {
  const { t } = useTranslation();
  const [selectedSlice, setSelectedSlice] = useState<SliceKey | null>(null);
  const total = income + expenses;
  const chartHeight = compact ? 124 : 120;
  const outerRadius = 50;
  const innerRadius = 30;

  const pieProps = {
    dataKey: 'value' as const,
    cx: '50%',
    cy: '50%',
    outerRadius,
    innerRadius,
    stroke: strokeColor,
    strokeWidth: 2,
    startAngle: 90,
    endAngle: -270,
    label: false as const,
    labelLine: false as const,
    isAnimationActive: false,
  };

  if (masked || total === 0) {
    return (
      <Box position="relative" w="100%" h={chartHeight}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie {...pieProps} data={[{ value: 1 }]} fill={emptyFillColor} />
          </PieChart>
        </ResponsiveContainer>
        <ChartCenterOverlay
          compact={compact}
          innerRadius={innerRadius}
          color={emptyLabelColor}
          selectedSlice={null}
          sliceLabels={{ income: '', expenses: '' }}
          sliceShares={{ income: 0, expenses: 0 }}
          fallbackLabel={masked ? '?' : '—'}
        />
      </Box>
    );
  }

  const expenseShare = Math.round((expenses / total) * 100);
  const incomeShare = 100 - expenseShare;
  const expensesDominant = expenses >= income;

  const sliceLabels: Record<SliceKey, string> = {
    income: t('home.addRevenueShort'),
    expenses: t('home.addExpenseShort'),
  };

  const sliceShares: Record<SliceKey, number> = {
    income: incomeShare,
    expenses: expenseShare,
  };

  const sliceLabelColors: Record<SliceKey, string> = {
    income: revenueLabelColor,
    expenses: expenseLabelColor,
  };

  const handleSliceClick = (slice: SliceKey) => {
    setSelectedSlice((current) => (current === slice ? null : slice));
  };

  const centerColor = selectedSlice
    ? sliceLabelColors[selectedSlice]
    : expensesDominant
      ? expenseLabelColor
      : revenueLabelColor;

  const data = [
    { name: 'income' as const, value: income },
    { name: 'expenses' as const, value: expenses },
  ];

  const colors = [revenueColor, expenseColor];

  return (
    <Box position="relative" w="100%" h={chartHeight}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            {...pieProps}
            data={data}
            paddingAngle={3}
            cornerRadius={4}
            onClick={(entry) => {
              const name = (entry as { name?: SliceKey }).name;
              if (name === 'income' || name === 'expenses') {
                handleSliceClick(name);
              }
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={colors[index]}
                stroke={strokeColor}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <ChartCenterOverlay
        compact={compact}
        innerRadius={innerRadius}
        color={centerColor}
        selectedSlice={selectedSlice}
        sliceLabels={sliceLabels}
        sliceShares={sliceShares}
        fallbackLabel={`${expensesDominant ? expenseShare : incomeShare}%`}
      />
    </Box>
  );
};
