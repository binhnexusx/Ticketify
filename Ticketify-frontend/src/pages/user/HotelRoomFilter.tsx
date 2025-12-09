import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SearchBar from '@/components/common/SearchBar';
import useRoomFilter from '@/hooks/useFilter';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import { useFavoriteRoom } from '@/hooks/useFilter';
import { GUEST_RATINGS } from '@/constants/rooms';
import Pagination from '@/components/ui/pagination';
import Loading from '@/components/common/Loading';
import { API_URL } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';
const HotelRoomFilter = () => {
  const {
    filterState,
    rooms,
    pagination,
    handlePageChange,
    loading: roomsLoading,
    error: roomsError,
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
    maxPrice,
    step,
  } = useRoomFilter();
  const { toast } = useToast();

  const { handleAdd, popupRoomId, handleDelete } = useFavoriteRoom();

  const { filterOptions, loading: filterLoading, error: filterError } = useFilterOptions();
  const navigate = useNavigate();

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 0;
    const roundedValue = Math.round(value / step) * step;
    updateMinPrice(roundedValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || filterState.range[1];
    const roundedValue = Math.round(value / step) * step;
    updateMaxPrice(Math.min(roundedValue, maxPrice));
  };

  const location = useLocation();

  const handleCardClick = (roomId: number) => {
    const currentQueryString = location.search || '';
    console.log('Navigate to:', `/rooms/${roomId}${currentQueryString}`);
    navigate(`/rooms/${roomId}${currentQueryString}`);
  };

  // Create skeleton cards for consistent layout
  const renderSkeletonCards = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <div key={`skeleton-${index}`} className="min-h-[280px]">
        <Loading variant="card" cardVariant="horizontal" size="md" className="w-full h-[280px]" />
      </div>
    ));
  };
  const hasToken = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return !!token;
  };

  const handleTokenCheck = () => {
    console.log('No token found');
    if (!hasToken()) {
      toast({
        title: 'Not logged in',
        description: 'Please log in to continue.',
        variant: 'destructive',
      });
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      return false;
    }
    return true;
  };

  // Render empty state with consistent height
  const renderEmptyState = () => (
    <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      <div className="space-y-3 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-200 rounded-full">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No rooms found</h3>
        <p className="max-w-sm text-sm text-gray-500">
          Try adjusting your filters to see more results, or check back later for new listings.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
          Refresh Search
        </Button>
      </div>
    </div>
  );

  // Render error state with consistent height
  const renderErrorState = () => (
    <div className="flex items-center justify-center min-h-[400px] bg-red-50 rounded-lg border-2 border-dashed border-red-200">
      <div className="space-y-3 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-900">Error loading rooms</h3>
        <p className="max-w-sm text-sm text-red-600">{roomsError}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-4 text-red-700 border-red-300 hover:bg-red-50"
        >
          Try Again
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <SearchBar onSearch={handleSearch} loading={roomsLoading} error={roomsError} />

        <div className="flex gap-12 w-full max-w-[1400px] px-4">
          {/* Fixed width sidebar */}
          <div className="w-[280px] flex-shrink-0">
            <div className="sticky p-6 bg-white border rounded-lg shadow-sm top-4">
              <h2 className="mb-6 text-2xl font-semibold text-[#565656]">Filter by</h2>

              {filterError && (
                <div className="p-3 mb-4 text-sm text-red-600 border border-red-200 rounded bg-red-50">
                  {filterError}
                </div>
              )}

              {filterLoading && (
                <div className="p-3 mb-4 text-sm text-blue-600 border border-blue-200 rounded bg-blue-50">
                  Loading filters...
                </div>
              )}

              <div className="flex flex-col gap-6">
                {/* Price Range Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-primary">Your nightly budget</p>
                  </div>

                  <Slider
                    value={filterState.range}
                    onValueChange={updateRange}
                    min={0}
                    max={maxPrice}
                    step={step}
                    className="w-full [&_.relative]:transition-none [&_[role=slider]]:transition-none"
                    disabled={filterLoading}
                  />

                  <div className="flex space-x-2 text-muted-foreground">
                    <Input
                      type="number"
                      id="minPrice"
                      value={filterState.range[0]}
                      onChange={handleMinChange}
                      placeholder="Min price $"
                      className="flex-1 placeholder:text-xs text-xs placeholder:text-[#A6A6A6]"
                      min={0}
                      max={filterState.range[1]}
                      step={step}
                      disabled={filterLoading}
                    />
                    <Input
                      type="number"
                      id="maxPrice"
                      value={filterState.range[1]}
                      onChange={handleMaxChange}
                      placeholder="Max price $"
                      className="flex-1 placeholder:text-xs text-xs placeholder:text-[#A6A6A6]"
                      min={filterState.range[0]}
                      max={maxPrice}
                      step={step}
                      disabled={filterLoading}
                    />
                  </div>
                </div>

                {/* Room Amenities Section */}
                <Collapsible open={openFacilities} onOpenChange={setOpenFacilities}>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-[#565656]">Room amenities</h3>
                    <div className="space-y-2">
                      {filterOptions?.amenities?.slice(0, 4).map((item) => (
                        <div key={item.amenity_id} className="flex items-center space-x-2">
                          <Checkbox
                            id={item.amenity_id.toString()}
                            checked={
                              filterState.selectedFacilities?.includes(item.amenity_id) || false
                            }
                            onCheckedChange={(checked: boolean) =>
                              updateFacilities(item.amenity_id, checked)
                            }
                            disabled={filterLoading}
                          />
                          <Label
                            htmlFor={item.amenity_id.toString()}
                            className="text-sm cursor-pointer text-muted-foreground"
                          >
                            {item.name}
                          </Label>
                        </div>
                      )) || <p className="text-sm text-gray-500">No amenities available</p>}
                    </div>

                    <CollapsibleContent className="space-y-2">
                      {filterOptions?.amenities?.slice(4).map((item) => (
                        <div key={item.amenity_id} className="flex items-center space-x-2">
                          <Checkbox
                            id={item.amenity_id.toString()}
                            checked={
                              filterState.selectedFacilities?.includes(item.amenity_id) || false
                            }
                            onCheckedChange={(checked: boolean) =>
                              updateFacilities(item.amenity_id, checked)
                            }
                            disabled={filterLoading}
                          />
                          <Label
                            htmlFor={item.amenity_id.toString()}
                            className="text-sm cursor-pointer text-muted-foreground"
                          >
                            {item.name}
                          </Label>
                        </div>
                      )) || <p className="text-sm text-gray-500">No additional amenities</p>}
                    </CollapsibleContent>

                    {filterOptions?.amenities && filterOptions.amenities.length > 4 && (
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="link"
                          className="flex items-center h-auto gap-1 px-0 py-0 text-xs w-fit text-root-primary-500 hover:underline"
                          disabled={filterLoading}
                        >
                          {openFacilities ? 'Show less' : 'Show more'}
                          {openFacilities ? (
                            <ChevronUp className="inline-block w-4 h-4" />
                          ) : (
                            <ChevronDown className="inline-block w-4 h-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    )}
                  </div>
                </Collapsible>

                {/* Guest Ratings Section */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[#565656]">Guest ratings</h3>
                  <RadioGroup
                    value={filterState.guestRating?.toString() || ''}
                    onValueChange={(value) => updateGuestRating(Number(value))}
                    className="space-y-2"
                    disabled={filterLoading}
                  >
                    {GUEST_RATINGS.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label
                          htmlFor={option.id}
                          className="text-sm cursor-pointer text-muted-foreground"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Floor Section */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[#565656]">Floor</h3>
                  <RadioGroup
                    value={filterState.floor?.toString() ?? 'all'}
                    onValueChange={(value) =>
                      updateFloor(value === 'all' ? undefined : Number(value))
                    }
                    className="space-y-2"
                    disabled={filterLoading}
                  >
                    {filterOptions?.floors?.map((floor) => (
                      <div key={floor.floor_id} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={floor.floor_id.toString()}
                          id={`floor-${floor.floor_id}`}
                        />
                        <Label
                          htmlFor={`floor-${floor.floor_id}`}
                          className="text-sm cursor-pointer text-muted-foreground"
                        >
                          {floor.name}
                        </Label>
                      </div>
                    )) || <p className="text-sm text-gray-500">No floors available</p>}
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed width content area */}
          <div className="flex-1 min-w-0">
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              {/* Loading indicator with consistent height */}
              {roomsLoading && (
                <div className="flex items-center gap-2 p-3 mb-4 text-sm text-blue-600 border border-blue-200 rounded bg-blue-50">
                  <div className="flex-shrink-0 w-4 h-4 border-2 border-blue-300 rounded-full border-t-blue-500 animate-spin"></div>
                  <span>Loading rooms...</span>
                </div>
              )}

              {/* Content with consistent minimum height */}
              <div className="min-h-[600px]">
                {roomsError ? (
                  renderErrorState()
                ) : roomsLoading && rooms.length === 0 ? (
                  <div className="space-y-4">{renderSkeletonCards()}</div>
                ) : rooms.length === 0 ? (
                  renderEmptyState()
                ) : (
                  <div className="space-y-4">
                    {/* Results header */}
                    <div className="flex items-center justify-between pb-4 border-b">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {pagination.totalItems} room{pagination.totalItems !== 1 ? 's' : ''} found
                      </h2>
                      <div className="text-sm text-gray-500">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </div>
                    </div>

                    {/* Room cards with consistent height */}
                    {rooms.map((room) => (
                      <div key={room.room_id} className="relative min-h-[280px]">
                        {popupRoomId === room.room_id && (
                          <div className="absolute z-20 p-3 bg-white border rounded-lg shadow-lg top-12 left-6 animate-fade-in">
                            <div className="mb-2 text-sm font-semibold text-center text-green-700">
                              ✓ Added to favorites
                            </div>
                            <Button
                              size="sm"
                              className="w-full text-xs bg-root-primary-500 hover:bg-root-primary-400"
                              onClick={() => navigate('/user/favouriteRooms')}
                            >
                              View favorites list →
                            </Button>
                          </div>
                        )}
                        <Card
                          variant="horizontal"
                          imageUrl={
                            room.images?.[0] ? `${API_URL}${room.images[0]}` : '/placeholder.jpg'
                          }
                          name={room.name}
                          description={room.description}
                          price={room.price.toString()}
                          roomType={room.roomType}
                          roomLevel={room.roomLevel}
                          floor={room.floor}
                          maxPeople={room.max_people}
                          finalPrice={parseFloat(room.final_price)}
                          deal={room.deal}
                          amenities={room.amenities}
                          roomId={room.room_id}
                          rating={room.rating}
                          onClick={() => handleCardClick(room.room_id)}
                          onAdd={async () => handleAdd(room.room_id.toString())}
                          onRemove={async () => handleDelete(room.room_id.toString())}
                          className="cursor-pointer transition-transform hover:scale-[1.02] h-[280px]"
                          handleTokenCheck={handleTokenCheck}
                        />
                      </div>
                    ))}

                    {/* Pagination with consistent positioning */}
                    <div className="pt-6 border-t">
                      <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelRoomFilter;
