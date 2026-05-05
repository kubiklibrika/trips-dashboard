import { describe, it, expect } from "vitest";
import * as XLSX from "xlsx";

/**
 * Test suite for program parsing from Excel files
 */
describe("Program Parsing from Excel", () => {
  it("should correctly parse program information from Excel file", () => {
    // Create a test workbook with program data
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["ФИО", "Факт оплаты", "Программа"],
      ["Иван Петров", "да", "с нуля"],
      ["Мария Сидорова", "нет", "База 2"],
      ["Алексей Иванов", "да", "с нуля"],
      ["Ольга Смирнова", "да", "Продвинутая"],
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const buffer = XLSX.write(workbook, { type: "buffer" });

    // Parse the buffer
    const parsedWorkbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = parsedWorkbook.Sheets[parsedWorkbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<any>(sheet);

    // Verify parsing
    expect(rows.length).toBe(4);
    
    // Check first participant
    expect(rows[0]["ФИО"]).toBe("Иван Петров");
    expect(rows[0]["Программа"]).toBe("с нуля");
    expect(rows[0]["Факт оплаты"]).toBe("да");

    // Check second participant
    expect(rows[1]["ФИО"]).toBe("Мария Сидорова");
    expect(rows[1]["Программа"]).toBe("База 2");
    expect(rows[1]["Факт оплаты"]).toBe("нет");

    // Check third participant
    expect(rows[2]["ФИО"]).toBe("Алексей Иванов");
    expect(rows[2]["Программа"]).toBe("с нуля");

    // Check fourth participant
    expect(rows[3]["ФИО"]).toBe("Ольга Смирнова");
    expect(rows[3]["Программа"]).toBe("Продвинутая");
  });

  it("should correctly count beginners vs other programs", () => {
    // Create test data
    const participants = [
      { name: "Иван Петров", paymentStatus: "paid", program: "с нуля" },
      { name: "Мария Сидорова", paymentStatus: "unpaid", program: "База 2" },
      { name: "Алексей Иванов", paymentStatus: "paid", program: "с нуля" },
      { name: "Ольга Смирнова", paymentStatus: "paid", program: "Продвинутая" },
      { name: "Петр Федоров", paymentStatus: "unpaid", program: "с нуля" },
    ];

    // Count beginners
    const beginnerCount = participants.filter(
      p => p.program && p.program.toLowerCase().includes('с нуля')
    ).length;

    // Count other programs
    const otherProgramCount = participants.filter(
      p => p.program && !p.program.toLowerCase().includes('с нуля')
    ).length;

    expect(beginnerCount).toBe(3);
    expect(otherProgramCount).toBe(2);
  });

  it("should handle empty program field gracefully", () => {
    const participants = [
      { name: "Иван Петров", paymentStatus: "paid", program: "" },
      { name: "Мария Сидорова", paymentStatus: "unpaid", program: "с нуля" },
      { name: "Алексей Иванов", paymentStatus: "paid", program: "unknown" },
    ];

    // Count beginners - should only count non-empty "с нуля"
    const beginnerCount = participants.filter(
      p => p.program && p.program.toLowerCase().includes('с нуля')
    ).length;

    expect(beginnerCount).toBe(1);
  });

  it("should distinguish between different program names", () => {
    const programs = [
      "с нуля",
      "База 1",
      "База 2",
      "Продвинутая",
      "Экспертная",
    ];

    const beginners = programs.filter(p => p.toLowerCase().includes('с нуля'));
    const others = programs.filter(p => !p.toLowerCase().includes('с нуля'));

    expect(beginners.length).toBe(1);
    expect(beginners[0]).toBe("с нуля");
    
    expect(others.length).toBe(4);
    expect(others).toContain("База 1");
    expect(others).toContain("База 2");
    expect(others).toContain("Продвинутая");
    expect(others).toContain("Экспертная");
  });

  it("should handle case-insensitive program matching", () => {
    const programs = [
      "С НУЛЯ",
      "с нуля",
      "С Нуля",
    ];

    const beginners = programs.filter(p => p.toLowerCase().includes('с нуля'));

    expect(beginners.length).toBe(3);
  });
});
