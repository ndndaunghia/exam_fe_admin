import React, { Fragment, useState, ChangeEvent, FormEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

interface Lesson {
  type: 'video' | 'quiz';
  content: string;
  options?: string[]; // for quiz questions
  correctAnswer?: string;
  correctAnswers?: boolean[];
  detailAnswer?: string;
}

interface Chapter {
  name: string;
  lessons: Lesson[];
}

interface FormData {
  courseName: string;
  courseDescription?: string;
  chapters: Chapter[];
  author: string;
  price: string;
  thumbnail?: string;
  subject: string;
}

const TableCourses: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    courseName: '',
    chapters: [{ name: '', lessons: [{ type: 'video', content: '' }] }],
    author: '',
    price: '',
    thumbnail: '',
    subject: '',
    courseDescription: '',
  });

  function toggleCorrectAnswer(
    chapterIndex: number,
    lessonIndex: number,
    optionIndex: number,
  ) {
    setFormData((prevData) => {
      const newChapters = JSON.parse(JSON.stringify(prevData.chapters));
      const lesson = newChapters[chapterIndex].lessons[lessonIndex];
      if (!lesson.correctAnswers) {
        lesson.correctAnswers = new Array(lesson.options?.length || 0).fill(
          false,
        );
      }
      lesson.correctAnswers[optionIndex] = !lesson.correctAnswers[optionIndex];

      // Update correctAnswer string
      const correctLetters = lesson.correctAnswers
        .map((isCorrect: any, index: any) =>
          isCorrect ? String.fromCharCode(65 + index) : null,
        )
        .filter(Boolean)
        .join(', ');
      lesson.correctAnswer = correctLetters;

      return { ...prevData, chapters: newChapters };
    });
  }

  function closeModal() {
    setIsOpen(false);
    setStep(1); // Reset bước khi đóng modal
  }

  function openModal() {
    setIsOpen(true);
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    chapterIndex: number | null = null,
    lessonIndex: number | null = null,
    optionIndex: number | null = null,
  ) {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (chapterIndex === null) {
        return { ...prevData, [name]: value };
      } else if (lessonIndex === null) {
        const newChapters = [...prevData.chapters];
        newChapters[chapterIndex].name = value;
        return { ...prevData, chapters: newChapters };
      } else if (optionIndex === null) {
        const newChapters = [...prevData.chapters];
        newChapters[chapterIndex].lessons[lessonIndex].content = value;
        return { ...prevData, chapters: newChapters };
      } else {
        const newChapters = [...prevData.chapters];
        if (!newChapters[chapterIndex].lessons[lessonIndex].options) {
          newChapters[chapterIndex].lessons[lessonIndex].options = [
            '',
            '',
            '',
            '',
          ];
        }
        newChapters[chapterIndex].lessons[lessonIndex].options![optionIndex] =
          value;
        return { ...prevData, chapters: newChapters };
      }
    });
  }

  function handleCorrectAnswerChange(
    e: ChangeEvent<HTMLInputElement>,
    chapterIndex: number,
    lessonIndex: number,
  ) {
    const { value } = e.target;
    setFormData((prevData) => {
      const newChapters = [...prevData.chapters];
      newChapters[chapterIndex].lessons[lessonIndex].correctAnswer = value;
      return { ...prevData, chapters: newChapters };
    });
  }

  function handleDetailAnswerChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    chapterIndex: number,
    lessonIndex: number,
  ) {
    const { value } = e.target;
    setFormData((prevData) => {
      const newChapters = [...prevData.chapters];
      newChapters[chapterIndex].lessons[lessonIndex].detailAnswer = value;
      return { ...prevData, chapters: newChapters };
    });
  }

  function addChapter() {
    setFormData((prevData) => ({
      ...prevData,
      chapters: [...prevData.chapters, { name: '', lessons: [] }],
    }));
  }

  function addLesson(chapterIndex: number, type: 'video' | 'quiz') {
    setFormData((prevData) => {
      const newChapters = [...prevData.chapters];
      newChapters[chapterIndex] = {
        ...newChapters[chapterIndex],
        lessons: [
          ...newChapters[chapterIndex].lessons,
          type === 'video'
            ? { type, content: '' }
            : { type, content: '', options: ['', '', '', ''] },
        ],
      };
      return { ...prevData, chapters: newChapters };
    });
  }

  function removeLesson(chapterIndex: number, lessonIndex: number) {
    setFormData((prevData) => {
      const newChapters = [...prevData.chapters];
      const newLessons = newChapters[chapterIndex].lessons.filter(
        (_, index) => index !== lessonIndex,
      );
      newChapters[chapterIndex] = {
        ...newChapters[chapterIndex],
        lessons: newLessons,
      };
      return { ...prevData, chapters: newChapters };
    });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const updatedFormData = {
      ...formData,
      chapters: formData.chapters.map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.map((lesson) => {
          if (lesson.type === 'quiz' && lesson.correctAnswers) {
            const correctAnswerString = lesson.correctAnswers
              .map((isCorrect, index) =>
                isCorrect ? String.fromCharCode(65 + index) : null,
              )
              .filter(Boolean)
              .join(', ');
            return { ...lesson, correctAnswer: correctAnswerString };
          }
          return lesson;
        }),
      })),
    };

    const formDataSubmit = JSON.parse(JSON.stringify(updatedFormData));
    formDataSubmit.chapters = formDataSubmit.chapters.map(
      (chapter: Chapter) => {
        chapter.lessons = chapter.lessons.map((lesson) => {
          if (lesson.type === 'quiz') {
            delete lesson.correctAnswers;
          }
          return lesson;
        });
        return chapter;
      },
    );

    console.log('Form submitted:', formDataSubmit);
    closeModal();
    // Reset form data...
  }

  function removeChapter(chapterIndex: number) {
    setFormData((prevData) => {
      const newChapters = [...prevData.chapters];
      newChapters.splice(chapterIndex, 1);
      return { ...prevData, chapters: newChapters };
    });
  }

  function nextStep() {
    setStep((prevStep) => prevStep + 1);
  }

  function prevStep() {
    setStep((prevStep) => prevStep - 1);
  }

  return (
    <>
      <Breadcrumb pageName="Table Courses" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="py-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Top Products
            </h4>
          </div>
          <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
            <div className="col-span-3 flex items-center">
              <p className="font-medium">ID</p>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="font-medium">Tên khóa học</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Số bài học</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Tác giả</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Giá</p>
            </div>
          </div>
        </div>
      </div>
      <button
        className="absolute bottom-5 right-10 bg-green-400 rounded-full hover:bg-green-700"
        onClick={openModal}
      >
        <svg
          viewBox="0 0 580 1000"
          fill="currentColor"
          height="4rem"
          width="4rem"
          color="white"
        >
          <path d="M550 450c20 0 30 16.667 30 50s-10 50-30 50H340v210c0 20-16.667 30-50 30s-50-10-50-30V550H30c-20 0-30-16.667-30-50s10-50 30-50h210V240c0-20 16.667-30 50-30s50 10 50 30v210h210" />
        </svg>
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto pt-18">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Thêm khóa học mới
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="mt-2">
                    {step === 1 && (
                      <>
                        <div className="mb-4">
                          <label
                            htmlFor="courseName"
                            className="block text-sm font-medium text-gray-700"
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
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 "
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
                            className="block text-sm font-medium text-gray-700"
                          >
                            Thumbnail
                          </label>
                          <input
                            type="url"
                            name="thumbnail"
                            id="thumbnail"
                            onChange={handleChange}
                            value={formData.thumbnail}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2 border-gray-300 border-[2px]"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="courseDescription"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Mô tả khóa học
                          </label>
                          <input
                            type="url"
                            name="courseDescription"
                            id="courseDescription"
                            onChange={handleChange}
                            value={formData.courseDescription}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2 border-gray-300 border-[2px]"
                            required
                          />
                        </div>

                        <div className="flex justify-between">
                          <button
                            type="button"
                            onClick={nextStep}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                          >
                            Tiếp tục
                          </button>
                        </div>
                      </>
                    )}
                    {step === 2 && (
                      <>
                        {formData.chapters.map((chapter, chapterIndex) => (
                          <div
                            key={chapterIndex}
                            className="mb-4 p-4 border rounded relative"
                          >
                            <label className="block text-sm font-medium text-gray-700">
                              Chương {chapterIndex + 1}
                            </label>
                            <input
                              type="text"
                              value={formData.chapters[chapterIndex].name}
                              onChange={(e) => handleChange(e, chapterIndex)}
                              placeholder="Tên chương"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2 border-gray-300 border-[2px]"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => removeChapter(chapterIndex)}
                              className="absolute top-1 right-1  hover:text-black-2"
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
                            {chapter.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="mt-2 relative">
                                <label className="block text-sm font-medium text-gray-700">
                                  {lesson.type === 'video'
                                    ? 'Video bài giảng'
                                    : 'Câu hỏi trắc nghiệm'}
                                </label>
                                <input
                                  type="text"
                                  value={lesson.content}
                                  onChange={(e) =>
                                    handleChange(e, chapterIndex, lessonIndex)
                                  }
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
                                    {lesson.options.map(
                                      (option, optionIndex) => (
                                        <div
                                          key={optionIndex}
                                          className="flex items-center"
                                        >
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
                                            placeholder={`Đáp án ${
                                              optionIndex + 1
                                            }`}
                                            className={`block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 p-1 border ${
                                              lesson.correctAnswers?.[
                                                optionIndex
                                              ]
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
                                            className={`ml-2 p-1 rounded-full ${
                                              lesson.correctAnswers?.[
                                                optionIndex
                                              ]
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200'
                                            }`}
                                          >
                                            ✓
                                          </button>
                                        </div>
                                      ),
                                    )}
                                    <textarea
                                      name="detailAnswer"
                                      placeholder="Đáp án chi tiết"
                                      className="mt-4 col-span-2 "
                                      value={
                                        formData.chapters[chapterIndex].lessons[
                                          lessonIndex
                                        ].detailAnswer
                                      }
                                      onChange={(e) =>
                                        handleDetailAnswerChange(
                                          e,
                                          chapterIndex,
                                          lessonIndex,
                                        )
                                      }
                                    >
                                      {
                                        formData.chapters[chapterIndex].lessons[
                                          lessonIndex
                                        ].detailAnswer
                                      }
                                    </textarea>
                                  </div>
                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeLesson(chapterIndex, lessonIndex)
                                  }
                                  className="absolute top-0 right-0  hover:text-black"
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
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={addChapter}
                          className="mt-2 px-3 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
                        >
                          + Thêm chương
                        </button>
                        <div className="flex justify-between">
                          <button
                            type="button"
                            onClick={prevStep}
                            className="bg-gray-500 text-black px-4 py-2 rounded-md"
                          >
                            Quay lại
                          </button>

                          <button
                            type="button"
                            onClick={nextStep}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                          >
                            Tiếp tục
                          </button>
                        </div>
                      </>
                    )}
                    {step === 3 && (
                      <>
                        <div className="mb-4">
                          <label
                            htmlFor="author"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Tác giả
                          </label>
                          <input
                            type="text"
                            name="author"
                            id="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2 border-gray-300 border-[2px]"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Giá
                          </label>
                          <input
                            type="text"
                            name="price"
                            id="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2 border-gray-300 border-[2px]"
                            required
                          />
                        </div>
                        <div className="flex justify-between">
                          <button
                            type="button"
                            onClick={prevStep}
                            className="bg-gray-500 text-black px-4 py-2 rounded-md"
                          >
                            Quay lại
                          </button>
                          <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                          >
                            Hoàn tất
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default TableCourses;
