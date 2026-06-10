/**
 * Formata inteiro YYYYMM (ex.: mesada / API) para data legível no locale.
 * Ex.: 202605 → "Maio de 2026" em pt-BR.
 */
export const formatYearMonthCompact = (
  ym: number,
  locale = 'pt-BR',
): string => {
  if (!Number.isFinite(ym)) return String(ym);
  const n = Math.trunc(ym);
  const year = Math.floor(Math.abs(n) / 100);
  const month = Math.abs(n) % 100;
  if (year < 1900 || year > 2100 || month < 1 || month > 12) {
    return String(ym);
  }
  const d = new Date(year, month - 1, 1);
  const raw = d.toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

export const formatDateToYYYYMMDD = (dateString: string | Date): string => {
  try {
    const date =
      typeof dateString === 'string' ? new Date(dateString) : dateString;

    if (isNaN(date.getTime())) {
      throw new Error('Data inválida');
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '';
  }
};

export const formatDateToBR = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  
  return date.toLocaleDateString('pt-BR', options);
};

export const getMonthRange = (
  dateString: string | Date,
): { startDate: string; endDate: string } => {
  try {
    const date =
      typeof dateString === 'string' ? new Date(dateString) : dateString;

    if (isNaN(date.getTime())) {
      throw new Error('Data inválida');
    }

    // Primeiro dia do mês
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

    // Último dia do mês (próximo mês, dia 0)
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return {
      startDate: formatDateToYYYYMMDD(startOfMonth),
      endDate: formatDateToYYYYMMDD(endOfMonth),
    };
  } catch (error) {
    console.error('Erro ao obter intervalo do mês:', error);
    return {
      startDate: '',
      endDate: '',
    };
  }
};

interface DayData {
  value: number;
  date: string;
}

export const fillMonthDays = (data: DayData[]): DayData[] => {
  try {
    if (!data || data.length === 0) {
      return [];
    }

    const firstDate = new Date(data[0].date);

    if (isNaN(firstDate.getTime())) {
      throw new Error('Data inválida no array');
    }

    const { startDate, endDate } = getMonthRange(firstDate);
    return fillDateRangeDays(data, startDate, endDate);
  } catch (error) {
    console.error('Erro ao preencher dias do mês:', error);
    return [];
  }
};

/** Preenche todos os dias entre startDate e endDate (YYYY-MM-DD), com zero onde não houver dado. */
export const fillDateRangeDays = (
  data: DayData[],
  rangeStart: string,
  rangeEnd: string,
): DayData[] => {
  try {
    if (!rangeStart || !rangeEnd) {
      return [];
    }

    const existingDates = new Map<string, number>();
    data.forEach((item) => {
      const dateKey = formatDateToYYYYMMDD(item.date);
      existingDates.set(dateKey, Number(item.value));
    });

    const result: DayData[] = [];
    const currentDate = new Date(`${rangeStart}T12:00:00`);
    const endDateObj = new Date(`${rangeEnd}T12:00:00`);

    if (isNaN(currentDate.getTime()) || isNaN(endDateObj.getTime())) {
      return [];
    }

    while (currentDate <= endDateObj) {
      const dateKey = formatDateToYYYYMMDD(currentDate);
      const isoDate = new Date(currentDate);
      isoDate.setHours(0, 0, 0, 0);

      result.push({
        value: existingDates.get(dateKey) ?? 0,
        date: isoDate.toISOString(),
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  } catch (error) {
    console.error('Erro ao preencher intervalo de datas:', error);
    return [];
  }
};

