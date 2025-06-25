import type { CouponReader } from "../services/couponReader";
import type { Expense } from '../services/resources';
import { formatCurrencyBRL } from "./formatCurrency";
import { formatDateToYYYYMMDD } from "./formatDate";

export interface NFCeQRCodeData {
  chaveAcesso: string; // Chave de acesso da NFCe
  versao: string; // Versão do QR Code
  tpAmb: string; // Tipo de ambiente (1=Produção, 2=Homologação)
  cDest: string; // CNPJ/CPF do destinatário
  dhEmi: string; // Data e hora de emissão
  vNF: string | null; // Valor da Nota Fiscal
  digVal: string | null; // Digest Value
  cIdToken: string | null; // Token
  rawData: string; // Dados brutos extraídos
  fullUrl: string; // URL completa original
}


export const convertQRData = (qrData: CouponReader): Expense | null => {
  try {
    const { uri, date, name, items } = qrData;

    const parsedItems = items.map((item) => {
      const { name, quantity, value, unit, group, code } = item;
      return {
        code: code ?? Math.random().toString(36).substr(2, 9),
        name,
        quantity: Number(quantity),
        value: formatCurrencyBRL(value.toString()),
        unit,
        group: {
          name: group.name
        },
        total: Number(quantity) * Number(value),
      };
    });

    return {
      name,
      uri: uri,
      date: formatDateToYYYYMMDD(date),
      repeat: qrData.repeat,
      value: qrData.value,
      store: {
        name: qrData.store.name,
      },
      payment: {
        name: qrData.payment.name,
      },
      items: parsedItems,
    };
  } catch (error) {
    console.error('Erro ao converter dados do QR Code:', error);
    return null;
  }
};

/**
 * Extrai o valor do parâmetro 'p' de uma URL de QR Code da NFCe
 * @param qrCodeUrl - URL completa do QR Code
 * @returns String com o valor do parâmetro 'p' ou null se não encontrado
 */
export const extractQRCodeData = (qrCodeUrl: string): string | null => {
  try {
    // Método 1: Usando URLSearchParams (mais robusto)
    const url = new URL(qrCodeUrl);
    const pValue = url.searchParams.get('p');
    
    return pValue;
  } catch (error) {
    console.error('Erro ao extrair dados do QR Code:', error);
    // Fallback: Se não conseguir parsear como URL, usar regex
    const match = qrCodeUrl.match(/[?&]p=([^&]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
}

/**
 * Versão que retorna todos os dados estruturados do QR Code NFCe
 * @param qrCodeUrl - URL completa do QR Code
 * @returns Objeto com os dados estruturados ou null se inválido
 */
export const parseNFCeQRCode = (qrCodeUrl: string): NFCeQRCodeData | null => {
  const pValue = extractQRCodeData(qrCodeUrl);
  
  if (!pValue) {
    return null;
  }

  const parts = pValue.split('|');
  
  if (parts.length < 5) {
    return null;
  }

  return {
    chaveAcesso: parts[0],
    versao: parts[1],
    tpAmb: parts[2],
    cDest: parts[3],
    dhEmi: parts[4],
    vNF: parts[5] || null,
    digVal: parts[6] || null,
    cIdToken: parts[7] || null,
    rawData: pValue,
    fullUrl: qrCodeUrl
  };
}
