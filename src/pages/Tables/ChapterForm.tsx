import React, { useState } from 'react';
import { Chapter, Lesson } from './type';

interface ChapterFormProps {
  chapters: Chapter[];
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    chapterIndex: number,
    lessonIndex?: number,
    optionIndex?: number,
  ) => void;
  handleDetailAnswerChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    chapterIndex: number,
    lessonIndex: number,
  ) => void;
  toggleCorrectAnswer: (
    chapterIndex: number,
    lessonIndex: number,
    optionIndex: number,
  ) => void;
  addChapter: () => void;
  removeChapter: (chapterIndex: number) => void;
  addLesson: (chapterIndex: number, type: 'video' | 'quiz') => void;
  removeLesson: (chapterIndex: number, lessonIndex: number) => void;
}

const ChapterForm: React.FC<ChapterFormProps> = ({
  chapters,
  handleChange,
  handleDetailAnswerChange,
  toggleCorrectAnswer,
  addChapter,
  removeChapter,
  addLesson,
  removeLesson,
}) => {
  const [expandedChapters, setExpandedChapters] = useState<boolean[]>(
    new Array(chapters.length).fill(true),
  );

  const toggleChapter = (index: number) => {
    setExpandedChapters((prev) => {
      const newExpanded = [...prev];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };

  return (
    <>
      {chapters.map((chapter, chapterIndex) => (
        <div key={chapterIndex} className="mb-4 p-4 border rounded relative">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 text-black">
              Chương {chapterIndex + 1}
            </label>
            <div>
              <button
                type="button"
                onClick={() => toggleChapter(chapterIndex)}
                className="mr-2 text-blue-500 hover:text-blue-700"
              >
                {expandedChapters[chapterIndex] ? '▲' : '▼'}
              </button>
              <button
                type="button"
                onClick={() => removeChapter(chapterIndex)}
                className="text-red-500 hover:text-red-700"
              >
                <svg
                  viewBox="0 0 448 512"
                  fill="currentColor"
                  height="1em"
                  width="1em"
                >
                  <path d="M160 400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16v208zm80 0c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16v208zm80 0c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16v208zm-2.5-375.06L354.2 80H424c13.3 0 24 10.75 24 24 0 13.3-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.18 0-80-35.8-80-80V128h-8c-13.25 0-24-10.7-24-24 0-13.25 10.75-24 24-24h69.82l36.68-55.06C140.9 9.357 158.4 0 177.1 0h93.8c18.7 0 36.2 9.358 46.6 24.94zM151.5 80h145l-19-28.44c-1.5-2.22-4-3.56-6.6-3.56h-93.8c-2.6 0-6 1.34-6.6 3.56L151.5 80zM80 432c0 17.7 14.33 32 32 32h224c17.7 0 32-14.3 32-32V128H80v304z" />
                </svg>
              </button>
            </div>
          </div>
          {expandedChapters[chapterIndex] && (
            <>
              <input
                type="text"
                value={chapter.name}
                onChange={(e) => handleChange(e, chapterIndex)}
                placeholder="Tên chương"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2 border-gray-300 border-[2px]"
                required
              />
              {chapter.lessons.map((lesson: Lesson, lessonIndex: number) => (
                <div key={lessonIndex} className="mt-2 relative">
                  <label className="block text-sm font-medium text-gray-700 text-black">
                    {lesson.type === 'video'
                      ? 'Video bài giảng'
                      : 'Câu hỏi trắc nghiệm'}
                  </label>
                  <input
                    type="text"
                    value={lesson.content}
                    onChange={(e) => handleChange(e, chapterIndex, lessonIndex)}
                    placeholder={
                      lesson.type === 'video'
                        ? 'Nhập link video bài giảng'
                        : 'Nội dung câu hỏi'
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2 border-gray-300 border-[2px]"
                    required
                  />
                  {lesson.type === 'quiz' && lesson.options && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {lesson.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              handleChange(
                                e,
                                chapterIndex,
                                lessonIndex,
                                optionIndex,
                              )
                            }
                            placeholder={`Đáp án ${optionIndex + 1}`}
                            className={`block w-full rounded-md shadow-sm  p-1 border ${
                              lesson.correctAnswers?.[optionIndex]
                                ? 'border-green-500 bg-green-100'
                                : 'border-gray-300'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              toggleCorrectAnswer(
                                chapterIndex,
                                lessonIndex,
                                optionIndex,
                              )
                            }
                            className={`ml-2 py-1 px-2 border border-gray-300 rounded-md ${
                              lesson.correctAnswers?.[optionIndex]
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200'
                            }`}
                          >
                            ✓
                          </button>
                        </div>
                      ))}
                      <textarea
                        name="detailAnswer"
                        placeholder="Đáp án chi tiết"
                        className="mt-4 col-span-2 p-2 text-black border border-gray-300 rounded-md "
                        value={lesson.detailAnswer}
                        onChange={(e) =>
                          handleDetailAnswerChange(e, chapterIndex, lessonIndex)
                        }
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeLesson(chapterIndex, lessonIndex)}
                    className="absolute top-0 right-0 hover:text-black"
                  >
                    <svg
                      viewBox="0 0 448 512"
                      fill="currentColor"
                      height="1em"
                      width="1em"
                    >
                      <path d="M160 400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16v208zm80 0c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16v208zm80 0c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16v208zm-2.5-375.06L354.2 80H424c13.3 0 24 10.75 24 24 0 13.3-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.18 0-80-35.8-80-80V128h-8c-13.25 0-24-10.7-24-24 0-13.25 10.75-24 24-24h69.82l36.68-55.06C140.9 9.357 158.4 0 177.1 0h93.8c18.7 0 36.2 9.358 46.6 24.94zM151.5 80h145l-19-28.44c-1.5-2.22-4-3.56-6.6-3.56h-93.8c-2.6 0-6 1.34-6.6 3.56L151.5 80zM80 432c0 17.7 14.33 32 32 32h224c17.7 0 32-14.3 32-32V128H80v304z" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="mt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => addLesson(chapterIndex, 'video')}
                  className="px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                >
                  + Video
                </button>
                <button
                  type="button"
                  onClick={() => addLesson(chapterIndex, 'quiz')}
                  className="px-2 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                >
                  + Câu hỏi
                </button>
              </div>
            </>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addChapter}
        className="mt-2 px-3 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
      >
        + Thêm chương
      </button>
    </>
  );
};

export default ChapterForm;
