import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROOM_TYPES, ROOM_LEVEL, Amenity, FLOORS } from '@/constants/rooms';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Room number is required'),
  status: z.string({ required_error: 'Select status' }),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  room_type_id: z.string().min(1, 'Select room type'),
  room_level_id: z.string().min(1, 'Select room level'),
  floor_id: z.string().min(1, 'Select floor'),
  images: z.any().optional(),
  image_urls: z.array(z.string()).optional(),
});

export type FormValues = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (room: FormValues) => void;
  initialValues?: FormValues;
};

export default function AddRoomForm({ open, onClose, onSave, initialValues }: Props) {
  useEffect(() => {
    if (!open) {
      form.reset({
        name: '',
        status: 'available',
        description: '',
        room_type_id: '',
        room_level_id: '',
        floor_id: '',
        amenities: [],
        image_urls: [],
      });
      setOldImages([]);
      setNewImages([]);
      setShowClear(false);
    }
  }, [open]);
  const [oldImages, setOldImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      status: 'available',
      description: '',
      room_type_id: '',
      room_level_id: '',
      floor_id: '',
      amenities: [],
      image_urls: [],
    },
  });

  const [showClear, setShowClear] = useState(false);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);

  useEffect(() => {
    if (open && initialValues) {
      let image_urls = initialValues.image_urls;
      if (!image_urls && Array.isArray(initialValues.images)) {
        image_urls = initialValues.images.filter((img) => typeof img === 'string');
      }
      const fixedValues = {
        ...initialValues,
        amenities: Array.isArray(initialValues.amenities)
          ? initialValues.amenities
          : initialValues.amenities
            ? String(initialValues.amenities)
                .split(',')
                .map((a) => a.trim())
                .filter(Boolean)
            : [],
        image_urls: image_urls || [],
      };
      form.reset(fixedValues);
      setShowClear(initialValues.name?.length > 0);
      setOldImages(image_urls || []);
      setNewImages([]);
    }
  }, [open, initialValues, form]);

  const handleRemoveOldImage = (url: string) => {
    setOldImages((prev) => prev.filter((img) => img !== url));
  };
  const handleRemoveNewImage = (idx: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setNewImages((prev) => [...prev, ...Array.from(files)]);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await onSave({
        ...data,
        image_urls: oldImages,
        images: newImages,
        room_type_id: String(Number(data.room_type_id)),
        room_level_id: String(Number(data.room_level_id)),
        floor_id: String(Number(data.floor_id)),
        amenities: Array.isArray(data.amenities) ? data.amenities.filter(Boolean) : [],
        status: 'available',
        name: String(data.name).trim(),
        description: String(data.description || ''),
      });
      onClose();
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Something went wrong';
      form.setError('name', { message });
    }
  };

  const getImageUrl = (url: string) => {
    console.log('getImageUrl', url);
    if (/^https?:\/\//.test(url)) return url;
    return `http://localhost:3000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Room number */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter room number"
                          {...field}
                          disabled={!!initialValues}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setShowClear(e.target.value.length > 0);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Amenities */}
              <FormField
                control={form.control}
                name="amenities"
                render={({ field }) => {
                  const selected = Array.isArray(field.value) ? field.value : [];
                  return (
                    <FormItem>
                      <FormLabel>Amenities</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div
                            className="w-full px-3 py-2 text-sm border rounded-md bg-white cursor-pointer min-h-[38px] max-h-24 overflow-y-auto flex items-start flex-wrap gap-2"
                            onClick={() => setAmenitiesOpen((v) => !v)}
                            tabIndex={0}
                          >
                            {selected.length === 0 ? (
                              <span className="text-gray-400">Select amenities</span>
                            ) : (
                              selected.map((amenity) => (
                                <span
                                  key={amenity}
                                  className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full"
                                >
                                  {amenity}
                                </span>
                              ))
                            )}
                          </div>

                          {amenitiesOpen && (
                            <div
                              className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border rounded-md shadow-lg max-h-40"
                              onMouseDown={(e) => e.stopPropagation()}
                              onBlur={() => setAmenitiesOpen(false)}
                              tabIndex={-1}
                            >
                              {Object.values(Amenity).map((amenity) => {
                                const isSelected = selected.includes(amenity);
                                return (
                                  <div
                                    key={amenity}
                                    className={`px-3 py-2 cursor-pointer ${
                                      isSelected ? ' text-blue-700' : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => {
                                      let newValue;
                                      if (isSelected) {
                                        newValue = selected.filter((a) => a !== amenity);
                                      } else {
                                        newValue = [...selected, amenity];
                                      }
                                      field.onChange(newValue);
                                    }}
                                  >
                                    {amenity}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {/* Room type */}
              <FormField
                control={form.control}
                name="room_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room type</FormLabel>
                    <FormControl>
                      <select className="w-full px-3 py-2 text-sm border rounded-md" {...field}>
                        {!field.value && (
                          <option value="" disabled hidden>
                            Select room type
                          </option>
                        )}
                        {ROOM_TYPES.map((type, idx) => (
                          <option key={type.id} value={idx + 1}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Room level */}
              <FormField
                control={form.control}
                name="room_level_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room level</FormLabel>
                    <FormControl>
                      <select className="w-full px-3 py-2 text-sm border rounded-md" {...field}>
                        {!field.value && (
                          <option value="" disabled hidden>
                            Select room level
                          </option>
                        )}
                        {ROOM_LEVEL.map((level, idx) => (
                          <option key={level.id} value={idx + 1}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Status*/}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        className="w-full px-3 py-2 text-sm bg-gray-100 border rounded-md cursor-not-allowed"
                        {...field}
                        disabled
                      >
                        <option value="available">available</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Floor*/}
              <FormField
                control={form.control}
                name="floor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floor</FormLabel>
                    <FormControl>
                      <select className="w-full px-3 py-2 text-sm border rounded-md" {...field}>
                        {!field.value && (
                          <option value="" disabled hidden>
                            Select floor
                          </option>
                        )}
                        {(FLOORS as any[]).map((floor) =>
                          typeof floor === 'object' &&
                          floor !== null &&
                          'id' in floor &&
                          'label' in floor ? (
                            <option key={floor.id} value={floor.id}>
                              {floor.label}
                            </option>
                          ) : (
                            <option key={floor} value={floor}>
                              {floor}
                            </option>
                          )
                        )}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <>
                      <Input type="file" multiple accept="image/*" onChange={handleFileChange} />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {/* Ảnh cũ */}
                        {oldImages.map((url, idx) => (
                          <div key={url} className="relative group">
                            <img
                              src={getImageUrl(url)}
                              alt={`Old ${idx}`}
                              className="object-cover w-20 h-20 rounded"
                            />
                            <button
                              type="button"
                              className="absolute top-0 right-0 invisible p-1 text-xs text-black rounded-full bg-white/80 hover:bg-red-500 hover:text-white group-hover:visible"
                              onClick={() => handleRemoveOldImage(url)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {/* Ảnh mới */}
                        {newImages.map((file, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`New ${idx}`}
                              className="object-cover w-20 h-20 rounded"
                            />
                            <button
                              type="button"
                              className="absolute top-0 right-0 invisible p-1 text-xs text-black rounded-full bg-white/80 hover:bg-red-500 hover:text-white group-hover:visible"
                              onClick={() => handleRemoveNewImage(idx)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter a description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Footer */}
            <DialogFooter className="justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="px-6 py-2 rounded-md text-adminLayout-primary-500 hover:text-adminLayout-primary-600"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 text-white rounded-md bg-adminLayout-primary-500 hover:bg-adminLayout-primary-600"
              >
                {initialValues ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
