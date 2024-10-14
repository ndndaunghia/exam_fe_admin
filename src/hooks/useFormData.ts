import { useState } from 'react';

interface Lesson {
  type: 'video' | 'quiz';
  content: string;
  options?: string[];
  correctAnswer?: string;
  detailAnswer?: string;
  numberOfOptions?: number;
}

interface Chapter {
  name: string;
  lessons: Lesson[];
}

export interface FormDataCourse {
  courseName: string;
  courseDescription?: string;
  chapters: Chapter[];
  author: string;
  price: string;
  thumbnail?: string;
  subject: string;
}

export const useFormDataCourse = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormDataCourse] = useState<FormDataCourse>({
    courseName: '',
    chapters: [{ name: '', lessons: [{ type: 'video', content: '' }] }],
    author: '',
    price: '',
    thumbnail: '',
    subject: '',
    courseDescription: '',
  });

  const closeModal = () => {
    setIsOpen(false);
    setStep(1);
  };

  const openModal = () => setIsOpen(true);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    chapterIndex: number | null = null,
    lessonIndex: number | null = null,
    optionIndex: number | null = null,
  ) {
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
          newChapters[chapterIndex].lessons[lessonIndex].options = [];
        }
        newChapters[chapterIndex].lessons[lessonIndex].options![optionIndex] = value;
        return { ...prevData, chapters: newChapters };
      }
    });
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted:', formData);
    closeModal();
    setFormDataCourse({
      courseName: '',
      chapters: [{ name: '', lessons: [{ type: 'video', content: '' }] }],
      author: '',
      price: '',
      thumbnail: '',
      subject: '',
      courseDescription: '',
    });
  };

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  return {
    isOpen,
    step,
    formData,
    closeModal,
    openModal,
    handleChange,
    handleSubmit,
    nextStep,
    prevStep,
    setFormDataCourse,
  };
};