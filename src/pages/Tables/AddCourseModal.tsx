import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import CourseForm from './CourseForm';
import ChapterForm from './ChapterForm';
import { FormDataCourse } from './type';

interface AddCourseModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSubmit: (formData: FormDataCourse) => void;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  closeModal,
  onSubmit,
}) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormDataCourse] = useState<FormDataCourse>({
    courseName: '',
    chapters: [{ name: '', lessons: [{ type: 'video', content: '' }] }],
    author: '',
    price: '',
    thumbnail: '',
    subject: '',
    courseDescription: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    chapterIndex: number | null = null,
    lessonIndex: number | null = null,
    optionIndex: number | null = null,
  ) => {
    const { name, value } = e.target;
    setFormDataCourse((prevData) => {
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
  };

  const handleDetailAnswerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    chapterIndex: number,
    lessonIndex: number,
  ) => {
    const { value } = e.target;
    setFormDataCourse((prevData) => {
      const newChapters = [...prevData.chapters];
      newChapters[chapterIndex].lessons[lessonIndex].detailAnswer = value;
      return { ...prevData, chapters: newChapters };
    });
  };

  const toggleCorrectAnswer = (
    chapterIndex: number,
    lessonIndex: number,
    optionIndex: number,
  ) => {
    setFormDataCourse((prevData) => {
      const newChapters = JSON.parse(JSON.stringify(prevData.chapters));
      const lesson = newChapters[chapterIndex].lessons[lessonIndex];
      if (!lesson.correctAnswers) {
        lesson.correctAnswers = new Array(lesson.options?.length || 0).fill(
          false,
        );
      }
      lesson.correctAnswers[optionIndex] = !lesson.correctAnswers[optionIndex];

      const correctLetters = lesson.correctAnswers
        .map((isCorrect: boolean, index: number) =>
          isCorrect ? String.fromCharCode(65 + index) : null,
        )
        .filter(Boolean)
        .join(', ');
      lesson.correctAnswer = correctLetters;

      return { ...prevData, chapters: newChapters };
    });
  };

  const addChapter = () => {
    setFormDataCourse((prevData) => ({
      ...prevData,
      chapters: [...prevData.chapters, { name: '', lessons: [] }],
    }));
  };

  const removeChapter = (chapterIndex: number) => {
    setFormDataCourse((prevData) => {
      const newChapters = [...prevData.chapters];
      newChapters.splice(chapterIndex, 1);
      return { ...prevData, chapters: newChapters };
    });
  };

  const addLesson = (chapterIndex: number, type: 'video' | 'quiz') => {
    setFormDataCourse((prevData) => {
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
  };

  const removeLesson = (chapterIndex: number, lessonIndex: number) => {
    setFormDataCourse((prevData) => {
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
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateStepThree()) {
      onSubmit(formData);
      closeModal();
      setStep(1);
      // setFormDataCourse({
      //   courseName: '',
      //   chapters: [{ name: '', lessons: [{ type: 'video', content: '' }] }],
      //   author: '',
      //   price: '',
      //   thumbnail: '',
      //   subject: '',
      //   courseDescription: '',
      // });
      setErrors([]);
    }
  };

  const nextStep = () => {
    let isValid = false;
    switch (step) {
      case 1:
        isValid = validateStepOne();
        break;
      case 2:
        isValid = validateStepTwo();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setStep((prevStep) => prevStep + 1);
      setErrors([]);
    }
  };
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  const validateStepOne = () => {
    const newErrors: string[] = [];
    if (!formData.courseName)
      newErrors.push('Tên khóa học không được để trống');
    // if (!formData.thumbnail) newErrors.push('Vui lòng chọn ảnh thumbnail');
    if (!formData.subject) newErrors.push('Vui lòng chọn môn học');
    if (!formData.courseDescription)
      newErrors.push('Mô tả khóa học không được để trống');
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const validateStepTwo = () => {
    const newErrors: string[] = [];
    if (formData.chapters.length === 0) {
      newErrors.push('Vui lòng thêm ít nhất một chương');
    } else {
      formData.chapters.forEach((chapter, index) => {
        if (!chapter.name)
          newErrors.push(`Tên chương ${index + 1} không được để trống`);
        if (chapter.lessons.length === 0)
          newErrors.push(`Chương ${index + 1} cần ít nhất một bài học`);
        chapter.lessons.forEach((lesson, lessonIndex) => {
          if (!lesson.content)
            newErrors.push(
              `Nội dung bài học ${lessonIndex + 1} trong chương ${
                index + 1
              } không được để trống`,
            );
        });
      });
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const validateStepThree = () => {
    const newErrors: string[] = [];
    if (!formData.author) newErrors.push('Tên tác giả không được để trống');
    if (!formData.price) newErrors.push('Giá khóa học không được để trống');
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  return (
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
                  className="text-lg font-semibold leading-6 text-gray-900 text-black text-center"
                >
                  Thêm khóa học mới
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-2">
                  {errors.length > 0 && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                      {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                    </div>
                  )}
                  {step === 1 && (
                    <>
                      <CourseForm
                        formData={formData}
                        handleChange={handleChange}
                        setFormData={setFormDataCourse}
                      />
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
                      <ChapterForm
                        chapters={formData.chapters}
                        handleChange={handleChange}
                        handleDetailAnswerChange={handleDetailAnswerChange}
                        toggleCorrectAnswer={toggleCorrectAnswer}
                        addChapter={addChapter}
                        removeChapter={removeChapter}
                        addLesson={addLesson}
                        removeLesson={removeLesson}
                      />
                      <div className="flex justify-between my-4">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="bg-gray-500 text-black px-4 py-2 rounded-md font-normal"
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
                          className="block text-sm font-medium text-black"
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
                          className="block text-sm font-medium text-black"
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
  );
};

export default AddCourseModal;
