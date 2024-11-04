import React from 'react';
import { FiVideo } from 'react-icons/fi';
import { BsClock, BsPersonVideo3 } from 'react-icons/bs';
import { Course } from '../../services/course/course.type';

interface CourseSummaryProps {
  course: Course;
}

const CourseSummary: React.FC<CourseSummaryProps> = ({ course }) => {
  return (
    <div className="md:col-span-1 px-2 flex justify-center dark:text-white">
      <div>
        <div className="rounded-xl">
          <img
            src={course.thumbnail_url || 'https://via.placeholder.com/150'}
            alt="Course Thumbnail"
            className="w-full h-full object-cover hover:opacity-80 rounded-xl"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-primary-light my-4">{course.price}đ</h4>
          <button className="bg-secondary-light text-white px-6 py-3 rounded-md hover:bg-secondary">
            MUA NGAY
          </button>
          <ul className="my-10 hidden md:flex md:flex-col md:justify-start md:items-start">
            <li className="flex justify-center items-center gap-2 my-2">
              <FiVideo />
              {course.duration || 0} bài học
            </li>
            <li className="flex justify-center items-center gap-2 my-2">
              <BsClock />
              Thời lượng {course.duration}
            </li>
            <li className="flex justify-center items-center gap-2 my-2">
              <BsPersonVideo3 />
              Học mọi lúc mọi nơi
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseSummary;
