import React, { useState } from 'react';
import { FormDataCourse } from './type';

interface CourseFormProps {
  formData: FormDataCourse;
  setFormData: React.Dispatch<React.SetStateAction<FormDataCourse>>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
}

const CourseForm: React.FC<CourseFormProps> = ({
  formData,
  handleChange,
  setFormData,
}) => {
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadName = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESENT_NAME;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setIsLoading(true);

      const cloudFormData = new FormData();
      cloudFormData.append('file', file);
      cloudFormData.append('upload_preset', uploadName);
      fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: cloudFormData,
      })
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);
          console.log(data);
          setImage(data.secure_url);
          setFormData((prevData) => ({
            ...prevData,
            thumbnail: data.secure_url,
          }));
        });
    }
  };

  return (
    <>
      <div className="mb-4">
        <label
          htmlFor="courseName"
          className="block text-sm font-medium text-gray-700 text-black"
        >
          Tên khóa học
        </label>
        <input
          type="text"
          name="courseName"
          id="courseName"
          value={formData.courseName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2 border-gray-300 border-[2px]"
          required
        />
      </div>

      <div className="mb-4">
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700"
        >
          <option value="" className="text-black">
            Chọn môn học
          </option>
          <option value="Toán">Toán</option>
          <option value="Lý">Lý</option>
          <option value="Anh">Anh</option>
          <option value="Tin">Tin</option>
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="thumbnail"
          className="block text-sm font-medium text-gray-700 text-black"
        >
          Thumbnail
        </label>
        <input
          type="file"
          name="thumbnail"
          id="thumbnail"
          onChange={handleImageChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2 border-gray-300 border-[2px]"
          required
        />
      </div>

      {isLoading && (
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      )}

      {image && (
        <div className="mb-4">
          <img
            src={image}
            alt="thumbnail"
            className="w-40 h-40 object-cover rounded-md"
          />
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="courseDescription"
          className="block text-sm font-medium text-gray-700 text-black"
        >
          Mô tả khóa học
        </label>
        <input
          type="text"
          name="courseDescription"
          id="courseDescription"
          onChange={handleChange}
          value={formData.courseDescription}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2 border-gray-300 border-[2px]"
          required
        />
      </div>
    </>
  );
};

export default CourseForm;
