import BirthForm from "@/components/BirthForm";
import Hero from "@/components/Hero";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="bg-brand-bg text-brand-navy selection:bg-brand-gold/30">
        <Hero />

        <section id="birth-form-section" className="min-h-screen flex items-center justify-center py-20 px-6 relative bg-white">
          <div className="absolute inset-0 bg-sacred-pattern opacity-5 pointer-events-none" />
          <div className="z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-16">

            <div className="lg:w-1/2 text-center lg:text-left space-y-6">
              <h2 className="font-serif text-4xl lg:text-5xl">The stars incline,<br />they do not bind.</h2>
              <p className="text-gray-500 font-light text-lg max-w-md mx-auto lg:mx-0">
                Unlock the precise planetary alignments of your exact moment of birth. An intricate map of your past karma and future potential.
              </p>
            </div>

            <div className="lg:w-1/2 flex justify-center lg:justify-end w-full">
              <BirthForm />
            </div>

          </div>
        </section>
      </main>
    </SmoothScroll>
  );
}
