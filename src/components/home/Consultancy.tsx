"use client";
import Image from "next/image";
import { Space } from "antd";
import { Button } from "react-bootstrap";

import { useRouter } from "next/navigation";

import nutYellow from "@/assets/icons/nut-yellow.svg";
import consultancy1 from "@/assets/img/consultancy-1.jpg";
import consultancy2 from "@/assets/img/consultancy-2.jpg";

export default function ConsultancyFields() {
  const router = useRouter();

  return (
    <section className="fields" id="consultancyFields">
      <h2 className="title">
        DISCIPLINES
      </h2>

      <Image
        src={nutYellow}
        width={54}
        height={54}
        alt="Nut Light Blue"
        style={{ margin: '40px 0' }}
      />

      <h2 className="subtitle">
        CONNECT WITH EXPERTS FROM DIFFERENT DISCIPLINES
      </h2>

      <div className="wrapper">
        <div className="col-one">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={consultancy1.src} alt="" />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={consultancy2.src} alt="" />
        </div>
        <div className="col-two">
          <ul className="list">
            <li>Administration</li>
            <li>Business Advisory</li>
            <li>Cost Estimation and Control</li>
            <li>Decommissioning of Offshore Facilities</li>
            <li>Emergency Response Plans</li>
            <li>Engineering and Design</li>
            <li>Environmental</li>
            <li>Human Resources</li>
            <li>Operations and Optimization:</li>
            <ul>
              <li>Chemical and Petrochemical</li>
              <li>Energy</li>
              <li>Industrial Processes</li>
              <li>Oil and Gas, Onshore and Offshore</li>
            </ul>
            <li>Planning and Control</li>
            <li>Production Plans</li>
            <li>Project Management</li>
            <li>QHSE</li>
            <li>Renewable Energies</li>
            <li>Research and Development</li>
            <li>Science and Technology</li>
            <li>Strategic Planning</li>
          </ul>
        </div>
      </div>

      <div>
        <p className="mb-5 text-xl font-bold">IF YOUR DISCIPLINE IS NOT LISTED BE THE FIRST!</p>
      </div>

      <Space size={16}>
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
  )
}