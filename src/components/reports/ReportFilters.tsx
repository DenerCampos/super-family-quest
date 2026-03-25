import { useState } from 'react';
import { Flex, Box, Checkbox, Collapse, Select } from '@chakra-ui/react';
import { ReportMonthYearFilter } from './ReportMonthYearFilter';
import { UserFamilyFilter } from './UserFamilyFilter';
import { DateRangeFilter } from './DateRangeFilter';
import { getYearOptions } from '../../utils/yearOptions';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import type { FamilyGroupResponseDto } from '../../types/familyGroup';

interface ReportFiltersProps {
  month: number;
  year: number;
  startDate: string;
  endDate: string;
  selectedUserId: string | null;
  familyGroup: FamilyGroupResponseDto | null;
  currentUserId: string;
  yearOnly?: boolean;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onUserChange: (userId: string | null) => void;
}

export const ReportFilters = ({
  month,
  year,
  startDate,
  endDate,
  selectedUserId,
  familyGroup,
  currentUserId,
  yearOnly = false,
  onMonthChange,
  onYearChange,
  onStartDateChange,
  onEndDateChange,
  onUserChange,
}: ReportFiltersProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const [showDateRange, setShowDateRange] = useState(false);

  return (
    <Box width="100%">
      <Flex
        direction="column"
        gap={3}
        p={4}
        borderRadius="lg"
        bg={getColor('background.dashboard.filterBar')}
        border="1px solid"
        borderColor={getColor('border.dashboard.tile')}
        boxShadow="sm"
      >
        {familyGroup && (
          <UserFamilyFilter
            familyGroup={familyGroup}
            currentUserId={currentUserId}
            selectedUserId={selectedUserId}
            onUserChange={onUserChange}
          />
        )}

        {yearOnly ? (
          <Select
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            size="sm"
            borderRadius="md"
            fontFamily={getFont('body')}
            color={getColor('text.dashboard.filterLabel')}
            borderColor={getColor('border.dashboard.tile')}
            bg={getColor('background.dashboard.filterBar')}
            width="100%"
          >
            {getYearOptions().map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
        ) : (
          <>
            <ReportMonthYearFilter
              month={month}
              year={year}
              onMonthChange={onMonthChange}
              onYearChange={onYearChange}
            />

            <Checkbox
              isChecked={showDateRange}
              onChange={(e) => setShowDateRange(e.target.checked)}
              size="sm"
              fontFamily={getFont('body')}
              colorScheme={getColor('button.primary')}
              color={getColor('text.dashboard.filterLabel')}
            >
              {t('dashboard.filters.customDateRange')}
            </Checkbox>

            <Collapse in={showDateRange} animateOpacity>
              <DateRangeFilter
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={onStartDateChange}
                onEndDateChange={onEndDateChange}
              />
            </Collapse>
          </>
        )}
      </Flex>
    </Box>
  );
};
