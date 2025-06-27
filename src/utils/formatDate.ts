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

    // Pega o primeiro item para determinar o mês/ano
    const firstDate = new Date(data[0].date);

    if (isNaN(firstDate.getTime())) {
      throw new Error('Data inválida no array');
    }

    // Obtém o intervalo do mês
    const { startDate, endDate } = getMonthRange(firstDate);

    // Converte as datas existentes para um Map para busca rápida
    const existingDates = new Map<string, string>();
    data.forEach((item) => {
      const dateKey = formatDateToYYYYMMDD(item.date);
      existingDates.set(dateKey, item.value.toString());
    });

    // Gera todos os dias do mês
    const result: DayData[] = [];
    const currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);

    while (currentDate <= endDateObj) {
      const dateKey = formatDateToYYYYMMDD(currentDate);
      const value = existingDates.get(dateKey) || '0';

      // Cria a data no formato ISO string (mantém o mesmo padrão do input)
      const isoDate = new Date(currentDate);
      isoDate.setHours(3, 0, 0, 0); // Mantém o horário 03:00:00.000Z do exemplo

      result.push({
        value: Number(value),
        date: isoDate.toISOString(),
      });

      // Avança para o próximo dia
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  } catch (error) {
    console.error('Erro ao preencher dias do mês:', error);
    return [];
  }
};

