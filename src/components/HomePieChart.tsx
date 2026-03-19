import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';

const RADIAN = Math.PI / 180;

type HomePieChartProps = {
  income: number;
  expenses: number;
  revenueColor: string;
  expenseColor: string;
  emptyFillColor: string;
  emptyLabelColor: string;
  labelColor: string;
};

export const HomePieChart = ({
  income,
  expenses,
  revenueColor,
  expenseColor,
  emptyFillColor,
  emptyLabelColor,
  labelColor,
}: HomePieChartProps) => {
  const total = income + expenses;

  const renderLabel = (props: PieLabelRenderProps) => {
    const cx = Number(props.cx ?? 0);
    const cy = Number(props.cy ?? 0);
    const midAngle = Number(props.midAngle ?? 0);
    const innerRadius = Number(props.innerRadius ?? 0);
    const outerRadius = Number(props.outerRadius ?? 0);
    const percent = Number(props.percent ?? 0);

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill={labelColor}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (total === 0) {
    return (
      <ResponsiveContainer width="100%" height={100}>
        <PieChart>
          <Pie
            data={[{ value: 1 }]}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={42}
            innerRadius={18}
            fill={emptyFillColor}
            stroke="none"
          >
            <Label
              value="0%"
              position="center"
              fontSize={11}
              fontWeight="bold"
              fill={emptyLabelColor}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }

  const data = [
    { name: 'income', value: income },
    { name: 'expenses', value: expenses },
  ];

  const colors: Record<string, string> = {
    income: revenueColor,
    expenses: expenseColor,
  };

  return (
    <ResponsiveContainer width="100%" height={100}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={42}
          innerRadius={18}
          stroke="none"
          labelLine={false}
          label={renderLabel}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={colors[entry.name]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
