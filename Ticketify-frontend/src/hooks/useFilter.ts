import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { debounce } from 'lodash';
import { useToast } from '@/hooks/use-toast';
import { addFavoriteRoom, deleteFavoriteRoom } from '@/services/profile';
import { API_URL } from '@/lib/axios';
import {
  RoomWithDetails,
  RoomListResponse,
  RoomSearchFormValues,
  UrlSearchParams,
  FilterState,
  ChangedFilters,
} from '@/types/index';
import { useFilterOptions } from '@/hooks/useFilterOptions';

// Helper function để tính toán step và max price động
const calculateSliderConfig = (maxPrice: number) => {
  let step: number;
  let adjustedMaxPrice: number;

  if (maxPrice <= 100) {
    // Giá nhỏ hơn hoặc bằng 100: step = 5, max = làm tròn lên 10
    step = 5;
    adjustedMaxPrice = Math.ceil(maxPrice / 10) * 10;
  } else if (maxPrice <= 1000) {
    // Giá từ 100-1000: step = 10, max = làm tròn lên 50
    step = 10;
    adjustedMaxPrice = Math.ceil(maxPrice / 50) * 50;
  } else if (maxPrice <= 5000) {
    // Giá từ 1000-5000: step = 50, max = làm tròn lên 100
    step = 50;
    adjustedMaxPrice = Math.ceil(maxPrice / 100) * 100;
  } else {
    // Giá lớn hơn 5000: step = 100, max = làm tròn lên 500
    step = 100;
    adjustedMaxPrice = Math.ceil(maxPrice / 500) * 500;
  }

  // Đảm bảo adjustedMaxPrice ít nhất lớn hơn maxPrice gốc 10%
  const minAdjustedPrice = Math.ceil(maxPrice * 1.1);
  adjustedMaxPrice = Math.max(adjustedMaxPrice, minAdjustedPrice);

  return { step, adjustedMaxPrice };
};

export const useFavoriteRoom = () => {
  const { toast } = useToast();
  const [popupRoomId, setPopupRoomId] = useState<number | null>(null);
  const [addFavorite, setAddFavorite] = useState<string | null>(null);
  const [deleteFavorite, setDeleteFavorite] = useState<string | null>(null);

  const hasToken = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return !!token;
  };


  const handleAdd = async (room_id: string): Promise<boolean> => {
    if (!hasToken()) {
      toast({
        title: 'Vui lòng đăng nhập',
        description: 'Bạn cần đăng nhập để thêm phòng vào danh sách yêu thích.',
        variant: 'destructive',
      });
      return false;
    }
    if (addFavorite === room_id) return false;

    setAddFavorite(room_id);
    setPopupRoomId(parseInt(room_id, 10));
    try {
      const res = await addFavoriteRoom(room_id);

      toast({
        title: 'Added',
        description: res.message || 'Added room to favorites successfully',
      });
      return true;
    } catch (error) {
      console.error('Failed to add room to favorites', error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 401) {
          toast({
            title: 'Session expired',
            description: 'Please log in again to perform this action.',
            variant: 'destructive',
          });
          return false;
        } else if (status === 400 && message === 'Room already in favorite list') {
          toast({
            title: 'Notification',
            description: 'This room is already in your favorites list.',
          });
          return false;
        } else {
          toast({
            title: 'Error',
            description: message || 'Failed to add room to favorites list.',
            variant: 'destructive',
          });
          return false;
        }
      } else {
        toast({
          title: 'Error undefined',
          description: 'An error occurred. Please try again later.',
          variant: 'destructive',
        });
        return false;
      }
    } finally {
      setAddFavorite(null);
    }
  };

    const handleDelete = async (room_id: string) => {
    if (!hasToken()) {
      toast({
        title: 'Vui lòng đăng nhập',
        description: 'Bạn cần đăng nhập để xóa phòng khỏi danh sách yêu thích.',
        variant: 'destructive',
      });
      return false;
    }
    if (deleteFavorite === room_id) return;
    setDeleteFavorite(room_id);
    try {
      const res = await deleteFavoriteRoom(room_id);
      toast({
        title: 'Deleted',
        description: res.message,
      });
    } catch (error) {
      console.error('Failed to delete', error);
      toast({
        title: 'Error',
        description: 'Failed to delete room from favorites.',
        variant: 'destructive',
      });
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 401) {
          toast({
            title: 'Session expired',
            description: 'Please log in again to perform this action.',
            variant: 'destructive',
          });
          return false;
        } else {
          toast({
            title: 'Error',
            description: message || 'Failed to delete room from favorites list.',
            variant: 'destructive',
          });
          return false;
        }
      } else {
        toast({
          title: 'Error undefined',
          description: 'An error occurred. Please try again later.',
          variant: 'destructive',
        });
        return false;
      }
    } finally {
      setDeleteFavorite(null);
    }
  };

  return { handleAdd, addFavorite, popupRoomId, handleDelete };
};

const parseSearchParams = (search: string): UrlSearchParams => {
  const urlParams = new URLSearchParams(search);
  const params: UrlSearchParams = {};
  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }
  return params;
};

const useRoomFilter = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { filterOptions, loading: filterLoading, error: filterError } = useFilterOptions();

  const [filterState, setFilterState] = useState<FilterState>({
    range: [0, 1000],
    selectedFacilities: [],
    guestRating: undefined,
    roomType: undefined,
    floor: undefined,
  });

  const [sliderConfig, setSliderConfig] = useState({
    step: 10,
    maxPrice: 1000,
  });

  const [changedFilters, setChangedFilters] = useState<ChangedFilters>({
    range: false,
    selectedFacilities: false,
    guestRating: false,
    roomType: false,
    floor: false,
  });
  const [openFacilities, setOpenFacilities] = useState(false);
  const [openRoomType, setOpenRoomType] = useState(false);
  const [rooms, setRooms] = useState<RoomWithDetails[]>([]);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
  }>({
    currentPage: 1,
    perPage: 5,
    totalPages: 1,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Build API params as a plain function (always uses latest state)
  const buildApiParams = () => {
    const params = new URLSearchParams();
    const urlParams = new URLSearchParams(location.search);
    const baseParams: Record<string, string | null> = {
      check_in_date: urlParams.get('check_in')
        ? format(new Date(urlParams.get('check_in')!), 'yyyy-MM-dd')
        : null,
      check_out_date: urlParams.get('check_out')
        ? format(new Date(urlParams.get('check_out')!), 'yyyy-MM-dd')
        : null,
      people: urlParams.get('people') || urlParams.get('max_people'),
      room_level: urlParams.get('room_level'),
      page: String(pagination.currentPage),
      perPage: String(pagination.perPage),
    };

    Object.entries(baseParams).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    if (changedFilters.range) {
      params.append('min_price', String(filterState.range[0]));
      params.append('max_price', String(filterState.range[1]));
    }
    if (changedFilters.selectedFacilities && filterState.selectedFacilities.length > 0) {
      params.append('amenities', filterState.selectedFacilities.join(','));
    }
    if (changedFilters.guestRating && filterState.guestRating !== undefined) {
      const minRatingMap: Record<number, string> = {
        5: '5',
        4: '4',
        3: '3',
        2: '2',
        1: '1',
      };
      params.append(
        'rating',
        minRatingMap[filterState.guestRating] || filterState.guestRating.toString()
      );
    }
    if (changedFilters.roomType && filterState.roomType !== undefined) {
      params.append('room_type', String(filterState.roomType));
    }
    if (changedFilters.floor && filterState.floor !== undefined) {
      params.append('floor', String(filterState.floor));
    }

    console.log('API Query String:', params.toString());
    return params.toString();
  };

  // Update slider config
  useEffect(() => {
    if (filterOptions?.priceRange?.max_price) {
      const originalMaxPrice = parseFloat(filterOptions.priceRange.max_price);
      const { step, adjustedMaxPrice } = calculateSliderConfig(originalMaxPrice);

      setSliderConfig({
        step,
        maxPrice: adjustedMaxPrice,
      });

      setFilterState((prev) => ({
        ...prev,
        range: [0, adjustedMaxPrice],
      }));
    }
  }, [filterOptions]);

  useEffect(() => {
    console.log('URL Params:', parseSearchParams(location.search));
  }, [location.search]);

  // Centralized fetching with debounce and cancellation
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryString = buildApiParams();
        const response = await axios.get<RoomListResponse>(
          `${API_URL}/api/rooms/filter?${queryString}`
        );
        setRooms(response.data.data.rooms);
        let newPagination = {
          currentPage: response.data.data.pagination.currentPage,
          perPage: response.data.data.pagination.perPage,
          totalPages: response.data.data.pagination.totalPages,
          totalItems: response.data.data.pagination.totalItems,
        };
        // Fix: If currentPage > totalPages, reset to totalPages
        if (newPagination.currentPage > newPagination.totalPages) {
          newPagination.currentPage = newPagination.totalPages || 1;
        }
        setPagination(newPagination);
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
        setError(filterError || 'Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };

    const debouncedFetch = debounce(fetch, 500);

    debouncedFetch();

    // Cleanup: Cancel debounce on unmount or dep change
    return () => {
      debouncedFetch.cancel();
    };
  }, [
    filterState,
    changedFilters,
    pagination.currentPage,
    pagination.perPage,
    location.search,
    filterError,
  ]); // All deps that should trigger refetch

  const handleSearch = (formData: RoomSearchFormValues) => {
    const newParams: UrlSearchParams = {
      check_in: format(formData.check_in, 'yyyy-MM-dd'),
      check_out: format(formData.check_out, 'yyyy-MM-dd'),
      people: formData.people?.toString(),
      room_level: formData.room_level?.toString() || '',
    };

    const newSearchParams = new URLSearchParams(newParams);
    setSearchParams(newSearchParams);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    // No explicit fetch here; useEffect will handle
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilterState((prev) => {
      const newState = { ...prev, [key]: value };
      setChangedFilters((prevChanged) => ({ ...prevChanged, [key]: true }));
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
      // No fetch here; useEffect will handle
      return newState;
    });
  };

  const updateRange = (newRange: number[]) => updateFilter('range', newRange);

  const updateFacilities = (amenityId: number, checked: boolean) => {
    setFilterState((prev) => {
      const updated = checked
        ? [...prev.selectedFacilities, amenityId]
        : prev.selectedFacilities.filter((id) => id !== amenityId);
      setChangedFilters((prevChanged) => ({ ...prevChanged, selectedFacilities: true }));
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
      // No fetch here
      return { ...prev, selectedFacilities: updated };
    });
  };

  const updateGuestRating = (value: string) => {
    const rating = value === 'all' ? undefined : Number(value);
    updateFilter('guestRating', rating);
  };

  const updateRoomType = (type: number | undefined) => updateFilter('roomType', type);
  const updateFloor = (floor: number | undefined) => updateFilter('floor', floor);

  const updateMinPrice = (value: number) => {
    const roundedValue = Math.round(value / sliderConfig.step) * sliderConfig.step;
    updateFilter('range', [
      Math.max(0, Math.min(roundedValue, filterState.range[1])),
      filterState.range[1],
    ]);
  };

  const updateMaxPrice = (value: number) => {
    const roundedValue = Math.round(value / sliderConfig.step) * sliderConfig.step;
    updateFilter('range', [
      filterState.range[0],
      Math.max(filterState.range[0], Math.min(roundedValue, sliderConfig.maxPrice)),
    ]);
  };

  return {
    filterState,
    searchParams,
    rooms,
    pagination,
    handlePageChange,
    loading: loading || filterLoading,
    error: error || filterError,
    openFacilities,
    openRoomType,
    setOpenFacilities,
    setOpenRoomType,
    handleSearch,
    updateRange,
    updateFacilities,
    updateGuestRating,
    updateRoomType,
    updateFloor,
    updateMinPrice,
    updateMaxPrice,
    maxPrice: sliderConfig.maxPrice,
    step: sliderConfig.step,
  };
};

export default useRoomFilter;
