import Hero from "@/components/landing_page/hero"
import Partners from "@/components/landing_page/partners";
import Introduction from "@/components/landing_page/introduction";
import Features from "@/components/landing_page/features";
import DAO from "@/components/landing_page/dao"
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="">
      <Hero/>
      <Partners/>
      <Introduction/>
      <Features/>
      <DAO/>
      <Footer/>
    </div>
  );
}
