'use client';
import { Select } from '@mantine/core';
import { useGlobalFiltersStore } from '@/store/globalFiltersStore';

export function GlobalYearSelector() {
  const { selectedYear, setSelectedYear, yearOptions } = useGlobalFiltersStore();

  return (
    <Select
      value={String(selectedYear)}
      onChange={(val) => val && setSelectedYear(Number(val))}
      data={yearOptions.map((y) => ({ value: String(y), label: String(y) }))}
      size="xs"
      w={80}
      title="Año activo del sistema"
      comboboxProps={{ withinPortal: true }}
    />
  );
}
