"use client";

import { Divider } from "antd";
import Image from "next/image";
import Link from "next/link";
import professorIcon from "@/assets/img/professor.png";
import studentIcon from "@/assets/img/student.png";

export default function AcademicSelect() {
  return (
    <>
      <h4 className="tw-text-center">CHOOSE YOUR ACADEMIC ROLE</h4>
          <div className="tw-flex tw-justify-center tw-w-full">
            <div className="tw-grid md:tw-grid-cols-2 tw-gap-6 tw-w-full tw-max-w-[700px]">
              <Link href="/auth/register/clients/academic/professor" className="tw-p-3" style={{
                border: "solid 2px rgba(0, 0, 0, 0.15)",
                textDecoration: "none",
                color: "black",
              }}>
                <div className="tw-flex tw-flex-col tw-items-center">
                  <Image
                    src={professorIcon}
                    width={120}
                    height={120}
                    alt="Professor"
                  />
                </div>
                <Divider/>
                <h2 className="tw-font-bold">PROFESSOR</h2>
                <p>
                  You are a member of the faculty (professor, researcher, scholar, lecturer) with a valid and active email address from your institution.
                </p>
              </Link>
              <Link href="/auth/register/clients/academic/student" className="tw-p-3" style={{
                border: "solid 2px rgba(0, 0, 0, 0.15)",
                textDecoration: "none",
                color: "black",
              }}>
                <div className="tw-flex tw-flex-col tw-items-center">
                  <Image
                    src={studentIcon}
                    width={120}
                    height={120}
                    alt="Student"
                  />
                </div>
                <Divider/>
                <h2 className="tw-font-bold">STUDENT</h2>
                <p>
                  You are either a full-time, part time or recently graduated student with a valid and active email address from your institution.
                </p>
              </Link>
            </div>
          </div>
    </>
  )
}