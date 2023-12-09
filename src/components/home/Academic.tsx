"use client";
import academic from "@/assets/img/academic.jpg";
import { useRouter } from "next/navigation";

import { Space } from "antd";
import { Button } from "react-bootstrap";

export default function AcademicSection() {
  const router = useRouter();

  return (
    <section className="academic">
      <div className="wrapper">
        <div className="col-one">
          <h2 className="title">ACADEMIC</h2>
          <h4>
            EXPERTTIS has a strong commitment to support professors and
            students on reaching their goals
          </h4>
          <ul>
            <li>Pre and Post Graduate</li>
            <li>Recurrent consultancies</li>
            <li>Important discounts on expert’s rates</li>
            <li>Students subscriptions can migrate to professional</li>
            <li>Enhance your professional networking</li>
          </ul>
        </div>
        <div className="col-two">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={academic.src} alt="" />
        </div>
      </div>
      <Space size={16} className="my-6">
        <Button
          variant="primary"
          onClick={() => router.push("/#search")}
        >
          BROWSE CONSULTANTS
        </Button>
        <Button
          variant="primary"
          onClick={() => router.push("/#subscriptions")}
        >
          CLICK AND SUBSCRIBE
        </Button>
      </Space>
    </section>
  );
}