// css for form elements

export const getInputClass = (hasError: boolean) =>
  `w-full px-3 py-2 border rounded-md transition focus:outline-none focus:ring-2 ${
    hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
  }`;

export const getLabelClass = (hasError: boolean) => `font-medium ${hasError ? 'text-black' : ''}`;
