"use client";
import Image from "next/image";
import { Button } from "react-bootstrap";
import { Space } from "antd";

import { useRouter } from "next/navigation";

//Icons features
import sf1 from "@/assets/sf/sf-1.svg";
import sf2 from "@/assets/sf/sf-2.svg";
import sf3 from "@/assets/sf/sf-3.svg";
import sf4 from "@/assets/sf/sf-4.svg";
import sf5 from "@/assets/sf/sf-5.svg";
import sf6 from "@/assets/sf/sf-6.svg";
import sf7 from "@/assets/sf/sf-7.svg";
import sf8 from "@/assets/sf/sf-8.svg";
import sf9 from "@/assets/sf/sf-9.svg";
import sf10 from "@/assets/sf/sf-10.svg";

export default function FeaturesSection() {
  const router = useRouter();

  return (
    <section className="features">
      <h2 className="title">FEATURES</h2>
      <div className="wrapper">
        <div className="col">
          <Image
            src={sf1}
            width={78}
            height={78}
            alt=""
          />
          <h4 className="title">
            EXPERTTIS
            SEARCH ENGINE
          </h4>
        </div>
        <div className="col">
          <Image
            src={sf2}
            width={78}
            height={78}
            alt=""
          />
          <h4 className="title">
            ACCESS TO
            DETAILED PROFILES
          </h4>
        </div>
        <div className="col">
          <Image
            src={sf3}
            width={78}
            height={78}
            alt=""
          />
          <h4 className="title">
            OUT OF PLATFORM
            ASSISTED SEARCH
          </h4>
        </div>
        <div className="col">
          <Image
            src={sf4}
            width={78}
            height={78}
            alt=""
          />
          <h4 className="title">
            GREAT PRE-SET
            RATES
          </h4>
        </div>
        <div className="col">
          <Image
            src={sf5}
            width={78}
            height={78}
            alt=""
          />
          <h4 className="title">
            LONG TERM
            CONSULTANCY OPTION
          </h4>
        </div>
      </div>
      <div className="wrapper">
        {/* <div className="col">
          <Image
            src={sf6}
            width={78}
            height={78}
            alt=""
          />
          <h4 className="title">
            EXPERT MESSAGING
          </h4>
        </div> */}
        <div className="col">
          <Image
            src={sf7}
            width={78}
            height={78}
            alt=""
          />
          <h4 className="title">
            EXPERT VIDEOCONFERENCE
          </h4>
        </div>
        <div className="col">
          <Image
            src={sf8}
            width={78}
            height={78}
            alt=""
          />
          <h4 className="title">
            EXPERT CHAT
          </h4>
        </div>
        <div className="col">
          <Image
            src={sf9}
            width={78}
            height={78}
            alt=""
          />
          <h4 className="title">
            SURVEYS & QA
          </h4>
        </div>
        <div className="col">
          <Image
            src={sf10}
            width={78}
            height={78}
            alt=""
          />
          <h4 className="title">
            ONLINE PAYMENT
          </h4>
        </div>
      </div>
      <Space size={16} className="my-4">
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