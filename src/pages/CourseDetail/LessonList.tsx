import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import EditIcon from '../../icons/EditIcon';
import DeleteIcon from '../../icons/DeleteIcon';
import { Lesson } from '../../services/lesson/lesson.type';

interface LessonsListProps {
  lessons: Lesson[];
  loading: boolean;
  expandedChapters: number[];
  toggleAllChapters: () => void;
  toggleChapter: (chapterId: number) => void;
  handleEditLesson: (moduleId: number) => void;
  handleDeleteLesson: (moduleId: number) => void;
  handleAddLesson: (moduleId: number) => void;
}

const LessonsList: React.FC<LessonsListProps> = ({
  lessons,
  loading,
  expandedChapters,
  toggleAllChapters,
  toggleChapter,
  handleEditLesson,
  handleDeleteLesson,
  handleAddLesson,
}) => {
  if (loading) return <div>Loading lessons...</div>;

  return (
    <div className="mt-10 flex flex-col gap-4">
      <div className="ml-auto"></div>
      {lessons.map((module) => (
        <div key={module.id}>
          <div
            onClick={() => toggleChapter(module.id)}
            className="flex justify-between items-center cursor-pointer bg-green-200 p-4 rounded-md"
          >
            <span>
              {module.order} : {module.name}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {console.log(111111);
                }}
                className="bg-blue-500 text-white px-2 py-2 rounded-full hover:bg-blue-600"
              >
                <FaPlus />
              </button>
              <EditIcon onClick={() => handleEditLesson(module.id)} />
              <DeleteIcon onClick={() => handleDeleteLesson(module.id)} />
              {expandedChapters.includes(module.id) ? (
                <IoIosArrowDown />
              ) : (
                <IoIosArrowUp />
              )}
            </div>
          </div>
        
        </div>
      ))}
    </div>
  );
};

export default LessonsList;
