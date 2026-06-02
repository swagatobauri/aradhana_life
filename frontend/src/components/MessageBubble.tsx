export default function MessageBubble({ role, content }: { role: 'user' | 'ai', content: string }) {
  const isUser = role === 'user';
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
      <div className={`p-3 max-w-[80%] rounded-lg ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
