import { motion } from 'framer-motion';

export default function MessageBubble({ role, content }: { role: 'user' | 'ai', content: string }) {
  const isUser = role === 'user';
  return (
    <div className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'} my-6`}>
      <div className={`flex items-end gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && (
          <div className="shrink-0 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-orange shadow-sm bg-gray-100">
              <img src="/guruji.png" alt="Guruji" className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-brand-purple mt-1 font-semibold">Guruji</span>
          </div>
        )}
        
        <div 
          className={`p-4 text-sm leading-relaxed tracking-wide ${
            isUser 
              ? 'bg-brand-navy text-brand-lavender rounded-sm' 
              : 'bg-white text-brand-navy border border-gray-200 rounded-sm'
          }`}
        >
          {content === '' && !isUser ? (
            <div className="flex gap-1.5 items-center justify-center h-5 w-8">
              <motion.div
                className="w-1.5 h-1.5 bg-brand-orange rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="w-1.5 h-1.5 bg-brand-orange rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
              <motion.div
                className="w-1.5 h-1.5 bg-brand-orange rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              />
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{content}</p>
          )}
        </div>
      </div>

      {!isUser && content.length > 50 && (
        <div className="flex items-start gap-2 mt-2 max-w-[85%] px-1 opacity-60 ml-12">
          <svg className="w-3.5 h-3.5 text-brand-purple mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[10px] text-gray-500 leading-tight">
            Astrology offers reflection, not certainty. Please don't make major life decisions based solely on a reading.
          </p>
        </div>
      )}
    </div>
  );
}
