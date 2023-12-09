import Header from "@/components/Header";
import AcademicSelect from "./client/select";
import Footer from "@/components/Footer";

export default function AcademicPage() {
  return (
    <>
      <Header/>
      <div>
        <section className="registration">
          <AcademicSelect/>
        </section>
      </div>
      <Footer/>
    </>
  );
}