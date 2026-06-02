import BirthForm from "@/components/BirthForm";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">AstroAgent</h1>
        <p className="text-gray-600">Your spiritual and astrological companion.</p>
      </div>
      <BirthForm />
    </main>
  );
}
