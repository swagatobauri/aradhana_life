'use client'

import { useChatStore } from '@/store/chatStore';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

export default function BirthForm() {
  const router = useRouter();
  const setBirthDetails = useChatStore((state) => state.setBirthDetails);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setBirthDetails({
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      place: formData.get('place') as string,
    });
    router.push('/chat');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-black">Your Birth Details</h2>
      
      <label className="flex flex-col text-sm text-gray-700">
        Date of Birth
        <input name="date" type="date" required className="mt-1 p-2 border rounded text-black" />
      </label>
      
      <label className="flex flex-col text-sm text-gray-700">
        Time of Birth
        <input name="time" type="time" required className="mt-1 p-2 border rounded text-black" />
      </label>
      
      <label className="flex flex-col text-sm text-gray-700">
        City of Birth
        <input name="place" type="text" placeholder="e.g. Mumbai, India" required className="mt-1 p-2 border rounded text-black" />
      </label>

      <button type="submit" className="mt-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Begin Journey
      </button>
    </form>
  );
}
