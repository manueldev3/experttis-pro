"use client";
import Header from "@/components/Header";
import AcademicForm from "./client/form";
import Error from "next/error";
import Footer from "@/components/Footer";

function AcademicSlug({ params }: {
  params: {
    slug: "professor" | "student",
  }
}) {
  if (params.slug !== "professor" && params.slug !== "student") {
    return <Error statusCode={404}/>
  }

  return (
    <>
      <Header/>
        <section className="registration">
          <div className="tw-flex tw-justify-center tw-p-6">
            <div className="tw-flex tw-flex-col tw-w-full md:tw-max-w-[1080px] tw-p-3" style={{
                border: "solid 2px rgba(0, 0, 0, 0.15)"
              }}
            >
              <h4 className="tw-font-bold">{params.slug.toUpperCase()} REGISTRATION</h4>
              <AcademicForm
                slug={params.slug}
              />
            </div>
          </div>
        </section>
      <Footer/>
    </>
  );
}

export default AcademicSlug;