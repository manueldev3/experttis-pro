"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Space } from "antd";
import { Button } from "react-bootstrap";

/* Assets */
import nutBlue from "@/assets/icons/nut-light-blue.svg";

export default function EnjoySection() {
  const router = useRouter();

  return (
    <section className="enjoy">
      <Image
        src={nutBlue}
        width={54}
        height={54}
        alt="Nut Light Blue"
        style={{ marginBottom: "40px" }}
      />
      <h2 className="py-6">
        ENJOY EXPERTTIS BENEFITS
      </h2>
      <h5>
        RELIABLE TOOL TO FIND EXPERTS WORLDWIDE
      </h5>
      <h5>
        DIRECT COMMUNICATION CLIENT-CONSULTANT
      </h5>
      <h5>
        SELF-MANAGED SERVICE
      </h5>
      <h5>
        LONG TERM SERVICE REQUESTS
      </h5>
      <h5>
        INTERVIEW EXPERTS FOR EMPLOYMENT
      </h5>
      <h5>
        ACCESS TO ASSISTED STAFFING-RECRUITMENT SERVICES
      </h5>
      <h5>
        EASY AND SECURE PAYMENT
      </h5>

      <Space size={26} className="my-4">
        <Button
          variant="primary"
          onClick={() => router.push("/auth/register/consultants")}
        >
          BECOME A CONSULTANT
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