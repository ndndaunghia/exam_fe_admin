import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Chapter } from './type';

interface AddChapterModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onAddChapter: (chapter: Chapter) => void;
}

const AddChapterModal: React.FC<AddChapterModalProps> = ({ isOpen, closeModal, onAddChapter }) => {
  const [chapterName, setChapterName] = useState('');
  const [lessons, setLessons] = useState<{ type: 'video' | 'quiz'; content: string; options?: string[] }[]>([
    { type: 'video', content: '' },
  ]);

  const handleAddLesson = (type: 'video' | 'quiz') => {
    setLessons([...lessons, type === 'video' ? { type, content: '' } : { type, content: '', options: ['', '', '', ''] }]);
  };

  const handleLessonChange = (index: number, content: string) => {
    const newLessons = [...lessons];
    newLessons[index].content = content;
    setLessons(newLessons);
  };

  const handleSubmit = () => {
    onAddChapter({ name: chapterName, lessons });
    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Thêm chương mới
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Tên chương"
                    value={chapterName}
                    onChange={(e) => setChapterName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2 border-gray-300 border-[2px]"
                    required
                  />
                  {lessons.map((lesson, index) => (
                    <div key={index} className="mt-2">
                      <input
                        type="text"
                        placeholder={lesson.type === 'video' ? 'Nhập link video bài giảng' : 'Nội dung câu hỏi'}
                        value={lesson.content}
                        onChange={(e) => handleLessonChange(index, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2 border-gray-300 border-[2px]"
                        required
                      />
                    </div>
                  ))}
                  <div className="mt-2 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleAddLesson('video')}
                      className="px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    >
                      + Video
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddLesson('quiz')}
                      className="px-2 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                    >
                      + Câu hỏi
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Thêm chương
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddChapterModal;