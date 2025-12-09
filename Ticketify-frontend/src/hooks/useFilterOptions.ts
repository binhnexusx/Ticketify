import { useState, useEffect } from 'react';
import { getFilterOptions } from '@/services/roomService';
import { FilterOptions } from '@/types/room';

export const useFilterOptions = () => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const data = await getFilterOptions();
        setFilterOptions(data);
      } catch (err) {
        setError('Không thể tải filter options');
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  return { filterOptions, loading, error };
};
