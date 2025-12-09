import { BasicInfoData } from '@/pages/user/BasicInfo';

type Props = {
  data: BasicInfoData;
  onEdit: () => void;
};

const BasicInfoView = ({ data, onEdit }: Props) => {
  const formatDate = (isoDate: string) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm ">
            Make sure this information matches your travel ID, like your passport or license.
          </p>
        </div>
        <button
          onClick={onEdit}
          className="text-sm font-medium text-root-primary-500 hover:underline"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <p className="font-bold text-l">Full Name</p>
          <p className="text-base font-medium text-root-gray-600">
            {data.firstName} {data.lastName}
          </p>
        </div>
        <div>
          <p className="font-bold text-l">Date of Birth</p>
          <p className="text-base font-medium text-root-gray-600">{formatDate(data.dob)}</p>
        </div>
        <div>
          <p className="font-bold text-l">Gender</p>
          <p className="text-base font-medium text-root-gray-600">
            {data.gender.charAt(0).toUpperCase() + data.gender.slice(1)}
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-root-gray-200">
        <h3 className="text-xl font-bold">Contact</h3>
        <p className="mt-1 text-sm">
          Receive account activity alerts and trip updates by sharing this information.
        </p>

        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
          <div>
            <p className="font-bold text-l">Mobile Number</p>
            <p className="text-base font-medium text-root-gray-600">{data.mobile}</p>
          </div>
          <div>
            <p className="font-bold text-l">Email</p>
            <p className="text-base font-medium text-root-gray-600 " title={data?.email}>
              {data.email.length > 35 ? data.email.slice(0, 30) + '...' : data.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoView;
