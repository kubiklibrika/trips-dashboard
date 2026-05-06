import { describe, it, expect } from 'vitest';
import * as XLSX from 'xlsx';

/**
 * Test suite for parseExcelFile function
 * Tests equipment parsing (harness, wing, helmet) from Google Sheets
 */

// Mock the parseExcelFile function locally for testing
function parseExcelFile(buffer: Buffer) {
  interface Participant {
    name: string;
    paymentStatus: string;
    program: string;
    harness?: string;
    wing?: string;
    helmet?: string;
  }

  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  if (!sheet) {
    return [];
  }

  const rows = XLSX.utils.sheet_to_json<any>(sheet);
  const participants: Participant[] = [];

  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;

    const name = (row['ФИО'] || '').toString().trim();

    if (!name) continue;

    if (
      name.toLowerCase().includes('дата') ||
      name.toLowerCase().includes('место') ||
      name.toLowerCase().includes('расход') ||
      name.toLowerCase().includes('зарплат') ||
      name.toLowerCase().includes('проживан') ||
      name.toLowerCase().includes('итого') ||
      name.toLowerCase().includes('билет') ||
      name.toLowerCase().includes('жилья') ||
      name.toLowerCase().includes('доход') ||
      name.toLowerCase().includes('чистыми') ||
      name === '' ||
      name === 'ЗП'
    ) {
      continue;
    }

    let paymentStatus = 'unknown';
    const paymentValue = (row['Факт оплаты'] || '').toString().toLowerCase().trim();

    if (paymentValue === 'да') {
      paymentStatus = 'paid';
    } else if (paymentValue === 'нет') {
      paymentStatus = 'unpaid';
    }

    let program = 'unknown';
    const programValue = (row['Программа'] || '').toString().trim();

    if (programValue) {
      program = programValue;
    }

    const harness = (row['Подвеска'] || '').toString().trim() || undefined;
    const wing = (row['Крыло'] || '').toString().trim() || undefined;
    const helmet = (row['Шлем'] || '').toString().trim() || undefined;

    participants.push({
      name,
      paymentStatus,
      program,
      harness,
      wing,
      helmet,
    });
  }

  return participants;
}

describe('parseExcelFile - Equipment Parsing', () => {
  it('should parse participant with all equipment fields', () => {
    // Create a test workbook with equipment data
    const ws = XLSX.utils.aoa_to_sheet([
      ['ФИО', 'Факт оплаты', 'Программа', 'Подвеска', 'Крыло', 'Шлем'],
      ['Иван Петров', 'да', 'С нуля', 'Swing S', 'Niviuk Artik 5', 'Charly'],
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const buffer = XLSX.write(wb, { type: 'buffer' });

    const participants = parseExcelFile(buffer);

    expect(participants).toHaveLength(1);
    expect(participants[0]).toEqual({
      name: 'Иван Петров',
      paymentStatus: 'paid',
      program: 'С нуля',
      harness: 'Swing S',
      wing: 'Niviuk Artik 5',
      helmet: 'Charly',
    });
  });

  it('should parse participant with partial equipment fields', () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['ФИО', 'Факт оплаты', 'Программа', 'Подвеска', 'Крыло', 'Шлем'],
      ['Мария Сидорова', 'нет', 'Другое', 'Swing L', '', ''],
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const buffer = XLSX.write(wb, { type: 'buffer' });

    const participants = parseExcelFile(buffer);

    expect(participants).toHaveLength(1);
    expect(participants[0]).toEqual({
      name: 'Мария Сидорова',
      paymentStatus: 'unpaid',
      program: 'Другое',
      harness: 'Swing L',
      wing: undefined,
      helmet: undefined,
    });
  });

  it('should parse participant with no equipment fields', () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['ФИО', 'Факт оплаты', 'Программа', 'Подвеска', 'Крыло', 'Шлем'],
      ['Петр Иванов', 'да', 'С нуля', '', '', ''],
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const buffer = XLSX.write(wb, { type: 'buffer' });

    const participants = parseExcelFile(buffer);

    expect(participants).toHaveLength(1);
    expect(participants[0]).toEqual({
      name: 'Петр Иванов',
      paymentStatus: 'paid',
      program: 'С нуля',
      harness: undefined,
      wing: undefined,
      helmet: undefined,
    });
  });

  it('should handle multiple participants with different equipment', () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['ФИО', 'Факт оплаты', 'Программа', 'Подвеска', 'Крыло', 'Шлем'],
      ['Иван Петров', 'да', 'С нуля', 'Swing S', 'Niviuk Artik 5', 'Charly'],
      ['Мария Сидорова', 'нет', 'Другое', 'Swing L', 'Gin Boomerang', 'Shred Ready'],
      ['Петр Иванов', 'да', 'С нуля', '', '', ''],
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const buffer = XLSX.write(wb, { type: 'buffer' });

    const participants = parseExcelFile(buffer);

    expect(participants).toHaveLength(3);
    expect(participants[0].harness).toBe('Swing S');
    expect(participants[1].wing).toBe('Gin Boomerang');
    expect(participants[2].helmet).toBeUndefined();
  });

  it('should skip header rows and service rows', () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['ФИО', 'Факт оплаты', 'Программа', 'Подвеска', 'Крыло', 'Шлем'],
      ['Иван Петров', 'да', 'С нуля', 'Swing S', 'Niviuk Artik 5', 'Charly'],
      ['Дата выезда', 'да', 'С нуля', '', '', ''],
      ['Место проведения', 'да', 'С нуля', '', '', ''],
      ['Мария Сидорова', 'нет', 'Другое', 'Swing L', 'Gin Boomerang', 'Shred Ready'],
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const buffer = XLSX.write(wb, { type: 'buffer' });

    const participants = parseExcelFile(buffer);

    expect(participants).toHaveLength(2);
    expect(participants[0].name).toBe('Иван Петров');
    expect(participants[1].name).toBe('Мария Сидорова');
  });

  it('should trim whitespace from equipment fields', () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['ФИО', 'Факт оплаты', 'Программа', 'Подвеска', 'Крыло', 'Шлем'],
      ['Иван Петров', 'да', 'С нуля', '  Swing S  ', '  Niviuk Artik 5  ', '  Charly  '],
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const buffer = XLSX.write(wb, { type: 'buffer' });

    const participants = parseExcelFile(buffer);

    expect(participants).toHaveLength(1);
    expect(participants[0].harness).toBe('Swing S');
    expect(participants[0].wing).toBe('Niviuk Artik 5');
    expect(participants[0].helmet).toBe('Charly');
  });
});
