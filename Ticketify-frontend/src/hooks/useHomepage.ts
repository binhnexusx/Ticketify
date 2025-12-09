import { useState, useEffect } from 'react';
import { HomepageData } from '@/types/index';
import { fetchHomepageData } from '@/services/homepageService';
import { addFavoriteRoom, deleteFavoriteRoom } from '@/services/profile';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface HomepageState {
  data: HomepageData | null;
  loading: boolean;
  error: string | null;
}

export const useHomepage = () => {
  const [state, setState] = useState<HomepageState>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const loadData = async () => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const response = await fetchHomepageData();
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: 'Failed to load homepage data',
        });
      }
    };

    loadData();
  }, []);

  return {
    rooms: state.data?.rooms || [],
    topAmenities: state.data?.topAmenities || [],
    topFeedbacks: state.data?.topFeedbacks || [],
    loading: state.loading,
    error: state.error,
  };
};

export const useFavoriteRoom = () => {
  const { toast } = useToast();
  const [addFavorite, setAddFavorite] = useState<string | null>(null);
  const [deleteFavorite, setDeleteFavorite] = useState<string | null>(null);

  const handleAdd = async (room_id: string): Promise<boolean> => {
    if (addFavorite === room_id) return false;
    setAddFavorite(room_id);
    try {
      const res = await addFavoriteRoom(room_id);
      toast({
        title: 'Added',
        description: res.message || 'Added room to favorites successfully',
      });
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        if (status === 401) {
          toast({
            title: 'Session expired',
            description: 'Please log in again to perform this action.',
            variant: 'destructive',
          });
        } else if (status === 400 && message === 'Room already in favorite list') {
          toast({
            title: 'Notification',
            description: 'This room is already in your favorites list.',
          });
        } else {
          toast({
            title: 'Error',
            description: message || 'Failed to add room to favorites list.',
            variant: 'destructive',
          });
        }
      }
      return false;
    } finally {
      setAddFavorite(null);
    }
  };

  const handleDelete = async (room_id: string) => {
    if (deleteFavorite === room_id) return;
    setDeleteFavorite(room_id);
    try {
      const res = await deleteFavoriteRoom(room_id);
      toast({
        title: 'Deleted',
        description: res.message,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete room from favorites.',
        variant: 'destructive',
      });
    } finally {
      setDeleteFavorite(null);
    }
  };

  return { handleAdd, addFavorite, handleDelete };
};
