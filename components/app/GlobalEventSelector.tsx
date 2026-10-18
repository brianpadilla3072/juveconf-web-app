'use client';
import { Select } from '@mantine/core';
import { useGlobalFiltersStore } from '@/store/globalFiltersStore';
import { useQueryEvents } from '@/hooks/Events/useQueryEvents';

export function GlobalEventSelector() {
  const { selectedYear, selectedEventId, setSelectedEventId } = useGlobalFiltersStore();
  const { events } = useQueryEvents();

  const availableEvents = events.filter((e) => !e.deletedAt && e.year === selectedYear);

  if (!availableEvents.length) return null;

  const data = [
    { value: '', label: 'Todos los eventos' },
    ...availableEvents.map((e) => ({ value: e.id, label: `${e.topic} ${e.year}` })),
  ];

  return (
    <Select
      value={selectedEventId || ''}
      onChange={(val) => setSelectedEventId(val ?? '')}
      data={data}
      size="xs"
      w={180}
      title="Evento activo del sistema"
      comboboxProps={{ withinPortal: true }}
    />
  );
}
