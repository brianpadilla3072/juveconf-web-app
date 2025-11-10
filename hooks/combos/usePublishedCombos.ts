import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios.config';

interface Combo {
  id: string;
  name: string;
  price: number;
  personsIncluded: number;
  maxPersons: number | null;
  isActive: boolean;
  isPublished: boolean;
  isFree: boolean;
  description: string;
  displayOrder: number;
  metadata: {
    benefits: string[];
  };
  eventId: string;
  event: {
    id: string;
    topic: string;
    year: number;
  };
}

export const usePublishedCombos = (eventId: string) => {
  return useQuery<Combo[]>({
    queryKey: ['combos', 'published', eventId],
    queryFn: async () => {
      const response = await api.get(`/combos/event/${eventId}/published`);
      return response.data;
    },
    enabled: !!eventId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
