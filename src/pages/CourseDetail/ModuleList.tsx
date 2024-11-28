import React, { useState } from 'react';
import { FaPlus, FaPlayCircle } from 'react-icons/fa';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { FaQuestionCircle } from 'react-icons/fa';
import EditIcon from '../../icons/EditIcon';
import DeleteIcon from '../../icons/DeleteIcon';
import { Lesson, Module, Question } from '../../services/course/course.type';


interface ModulesListProps {
  modules: Module[];
  lessons: Lesson[];
  questions: Question[];
  loading: boolean;
  expandedChapters: number[];
  toggleAllChapters: () => void;
  toggleChapter: (chapterId: number) => void;
  handleEditModule: (moduleId: number) => void;
  handleDeleteModule: (moduleId: number) => void;
  handleAddLesson: (moduleId: number) => void;
  handleEditLesson: (lessonId: number) => void;
  handleDeleteLesson: (lessonId: number) => void;
  handleAddQuestion: (lessonId: number) => void;
  handleEditQuestion: (questionId: number) => void;
  handleDeleteQuestion: (questionId: number) => void;
}

const ModulesList: React.FC<ModulesListProps> = ({
  modules,
  lessons,
  questions,
  loading,
  expandedChapters,
  toggleAllChapters,
  toggleChapter,
  handleEditModule,
  handleDeleteModule,
  handleAddLesson,
  handleEditLesson,
  handleDeleteLesson,
  handleAddQuestion,
  handleEditQuestion,
  handleDeleteQuestion,
}) => {
  const [expandedLessons, setExpandedLessons] = useState<number[]>([]);

  if (loading) return <div>Loading modules...</div>;

  // Toggle mở rộng hoặc thu gọn danh sách câu hỏi của một bài giảng
  const toggleLessonQuestions = (lessonId: number) => {
    setExpandedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId],
    );
  };

  console.log('modules', modules);
  console.log('lessons', lessons);
  console.log('questions', questions);
  

  return (
    <div className="mt-10 flex flex-col gap-2">
      <div className="ml-auto">
        <span
          className="text-primary font-bold cursor-pointer"
          onClick={toggleAllChapters}
        >
          {expandedChapters.length === modules.length
            ? 'Thu gọn tất cả'
            : 'Mở rộng tất cả'}
        </span>
      </div>
      {modules.map((module) => (
        <div key={module.id} className="module-item">
          <div
            onClick={() => toggleChapter(module.id)}
            className="flex justify-between items-center cursor-pointer bg-[#ffffff] p-4 rounded-md"
          >
            <span className="font-medium text-black">{module.name}</span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAddLesson(module.id)}
                className="bg-blue-500 text-white px-2 py-2 rounded-full hover:bg-blue-600"
              >
                <FaPlus />
              </button>
              <EditIcon onClick={() => handleEditModule(module.id)} />
              <DeleteIcon onClick={() => handleDeleteModule(module.id)} />
              {expandedChapters.includes(module.id) ? (
                <IoIosArrowUp />
              ) : (
                <IoIosArrowDown />
              )}
            </div>
          </div>

          {expandedChapters.includes(module.id) && (
            <div className="lessons-list mt-2 ml-2">
              {lessons
                ?.filter((lesson) => lesson.module_id === module.id)
                .map((lesson) => (
                  <React.Fragment key={lesson.id}>
                    <div className="lesson-item my-2 bg-[#b0bec5] px-4 py-2 rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="flex-row flex justify-center items-center gap-4">
                          <FaPlayCircle color="#009e6a" />
                          <span className="text-white font-medium">
                            {lesson.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddQuestion(lesson.id)}
                            className="bg-blue-500 text-white px-2 py-2 rounded-full hover:bg-blue-600"
                          >
                            <FaPlus />
                          </button>
                          <EditIcon
                            onClick={() => handleEditLesson(lesson.id)}
                          />
                          <DeleteIcon
                            onClick={() => handleDeleteLesson(lesson.id)}
                          />
                          {/* Toggle hiển thị câu hỏi */}
                          <button
                            onClick={() => toggleLessonQuestions(lesson.id)}
                            className="text-white hover:text-gray-300"
                          >
                            {expandedLessons.includes(lesson.id) ? (
                              <IoIosArrowUp />
                            ) : (
                              <IoIosArrowDown />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Hiển thị câu hỏi nếu bài giảng được mở rộng */}
                    {expandedLessons.includes(lesson.id) && (
                      <div className="questions-list mt-2 ml-2">
                        {questions
                          .filter(
                            (question) => question.lesson_id === lesson.id,
                          )
                          .map((question) => (
                            <div
                              key={question.id}
                              className="question-item flex justify-between items-center bg-[#e0e0e0] px-4 py-2 rounded-md my-2"
                            >
                              <div className="flex justify-center items-center gap-2">
                                <FaQuestionCircle color="#ff9800"/>
                                <span className="text-black font-medium">
                                  {question.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <EditIcon
                                  onClick={() =>
                                    handleEditQuestion(question.id)
                                  }
                                />
                                <DeleteIcon
                                  onClick={() =>
                                    handleDeleteQuestion(question.id)
                                  }
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </React.Fragment>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ModulesList;
