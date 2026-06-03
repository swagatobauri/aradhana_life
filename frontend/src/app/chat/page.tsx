import ChatWindow from "@/components/ChatWindow";
import ChartLoadingAnimation from "@/components/ChartLoadingAnimation";
import ApiDashboard from "@/components/ApiDashboard";
import ChakraBackground from "@/components/ChakraBackground";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[#FCF9F2] relative overflow-hidden flex justify-center">
      
      {/* 3-Panel Layout Container */}
      <div className="w-full max-w-7xl h-screen flex flex-col md:flex-row relative z-10">
        
        {/* LEFT PANEL: API Dashboard & Branding */}
        <div className="hidden md:flex flex-col w-[280px] p-8 shrink-0 h-full border-r border-gray-200/50">
          <ApiDashboard />
        </div>

        {/* CENTER PANEL: Chat Interface */}
        <div className="flex-1 flex flex-col h-full relative z-20 shadow-2xl md:shadow-none bg-white md:bg-transparent">
          <ChartLoadingAnimation />
          <ChatWindow />
        </div>

        {/* RIGHT PANEL: Decorative Chakra */}
        <div className="hidden lg:block w-[350px] shrink-0 h-full relative">
          <div className="absolute inset-0">
            <ChakraBackground />
          </div>
        </div>

      </div>

    </main>
  );
}
