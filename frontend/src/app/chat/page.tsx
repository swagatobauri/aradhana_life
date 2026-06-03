import ChatWindow from "@/components/ChatWindow";
import ChartLoadingAnimation from "@/components/ChartLoadingAnimation";
import ApiDashboard from "@/components/ApiDashboard";
import ChakraBackground from "@/components/ChakraBackground";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[#FCF9F2] relative overflow-hidden flex justify-center">
      
      {/* Full Screen Galaxy Background */}
      <div className="absolute inset-0 z-0">
        <ChakraBackground />
      </div>

      {/* 3-Panel Layout Container */}
      <div className="w-full max-w-7xl h-screen flex flex-col md:flex-row relative z-10 pointer-events-none">
        
        {/* LEFT PANEL: API Dashboard & Branding */}
        <div className="hidden md:flex flex-col w-[300px] p-8 shrink-0 h-full border-r border-brand-gold/10 pointer-events-auto">
          <ApiDashboard />
        </div>

        {/* CENTER PANEL: Chat Interface */}
        <div className="flex-1 flex flex-col h-full relative z-20 shadow-2xl md:shadow-none bg-white/40 md:bg-transparent backdrop-blur-sm pointer-events-auto max-w-3xl mx-auto">
          <ChartLoadingAnimation />
          <ChatWindow />
        </div>

        {/* RIGHT PANEL: Empty spacer to balance center chat */}
        <div className="hidden lg:block w-[300px] shrink-0 h-full border-l border-brand-gold/10" />
      </div>

    </main>
  );
}
