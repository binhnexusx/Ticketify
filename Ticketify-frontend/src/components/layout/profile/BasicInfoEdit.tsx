import { useRef, useState, useEffect } from 'react';
import { BasicInfoData } from '@/pages/user/BasicInfo';
import { Button } from '@/components/ui/button';
import { CameraIcon } from 'lucide-react';
import { API_URL } from '@/constants/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

type Props = {
  data: BasicInfoData;
  setData: (data: BasicInfoData) => void;
  onSave: () => void;
  onCancel: () => void;
  loading: boolean;
};

const BasicInfoEdit = ({ data, setData, onSave, onCancel, loading }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const [errors, setErrors] = useState<Partial<Record<keyof BasicInfoData, string>>>({});

  const selectedDob = data.dob ? dayjs(data.dob, 'YYYY-MM-DD').toDate() : null;

  const validateField = (key: keyof BasicInfoData, value: string) => {
    let error = '';
    if (key === 'firstName' && !value.trim()) {
      error = 'First name is required';
    }
    if (key === 'lastName' && !value.trim()) {
      error = 'Last name is required';
    }
    if (key === 'mobile' && !/^\d{11}$/.test(value)) {
      error = 'Mobile number must be exactly 11 digits';
    }
    if (key === 'mobile' && !value.trim()) {
      error = 'Phone Number is required';
    }
    setErrors((prev) => ({ ...prev, [key]: error }));
  };

  const handleChange = (key: keyof BasicInfoData, value: string) => {
    setData({ ...data, [key]: value });
    validateField(key, value);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formatted = dayjs(date).format('YYYY-MM-DD');
      handleChange('dob', formatted);
    } else {
      handleChange('dob', '');
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    return () => {
      if (previewAvatar) {
        URL.revokeObjectURL(previewAvatar);
      }
    };
  }, [previewAvatar]);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    handleChange('mobile', value);
  };

  const handleMobilePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    let paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 11);
    e.preventDefault();
    handleChange('mobile', paste);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 2 * 1024 * 1024;

    if (!allowedTypes.includes(file.type) || file.size > maxSize) {
      e.target.value = '';
      return;
    }

    setData({ ...data, avatar: file });
    setPreviewAvatar(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm">
          Make sure this information matches your travel ID, like your passport or license.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {/* First Name */}
          <div>
            <label className="text-sm font-bold">First Name</label>
            <input
              className="w-full px-3 py-2 border rounded"
              value={data.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              maxLength={20}
              required
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm font-bold">Last Name</label>
            <input
              className="w-full px-3 py-2 border rounded"
              value={data.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              maxLength={20}
              required
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
          </div>

          {/* Mobile */}
          <div>
            <label className="text-sm font-bold">Mobile Number</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={11}
              required
              className="w-full px-3 py-2 border rounded"
              value={data.mobile}
              onChange={handleMobileChange}
              onPaste={handleMobilePaste}
            />
            {errors.mobile && <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>}
          </div>

          {/* DOB */}
          <div className="flex flex-col">
            <label className="text-sm font-bold">Date of Birth</label>
            <DatePicker
              selected={selectedDob}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              className="w-full px-3 py-2 border rounded"
              maxDate={new Date()}
              dropdownMode="select"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm font-bold">Gender</label>
            <div className="flex flex-col gap-2 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={data.gender === 'female'}
                  onChange={() => handleChange('gender', 'female')}
                />
                Female
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={data.gender === 'male'}
                  onChange={() => handleChange('gender', 'male')}
                />
                Male
              </label>
            </div>
          </div>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm font-bold">Profile picture</p>
          <img
            src={
              previewAvatar
                ? previewAvatar
                : typeof data.avatar === 'string'
                  ? `${API_URL}${data.avatar}`
                  : '/assets/images/avatar.png'
            }
            alt="avatar"
            className="object-cover border rounded-full w-28 h-28"
          />
          <Button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded bg-root-primary-500"
            onClick={handleFileClick}
          >
            <span className="flex items-center gap-2">
              <CameraIcon className="w-4 h-4 align-middle" />
              Upload New Photo
            </span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-4 mt-6">
        <Button variant="outline" onClick={onCancel} className="w-1/2">
          Cancel
        </Button>
        <Button
          className="w-1/2 text-white bg-root-primary-500"
          onClick={onSave}
          disabled={loading}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default BasicInfoEdit;
