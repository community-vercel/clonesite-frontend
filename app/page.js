import Footer from "@/components/Footer";
import Categories from "@/components/home/Categories";
import Hero from "@/components/Hero";
import Header from "@/components/layout/Header";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
// import FeaturedServices from "@/components/FeaturedServices";
import FeaturedServices from "@/components/home/FeaturedServices";


export default function Home() {
  return (
    <div className="min-h-screen">
      {/* <Header /> */}
      <main>
        <Hero />
        <Categories />
        <FeaturedServices />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}