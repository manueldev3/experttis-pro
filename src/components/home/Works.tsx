import Image from "next/image";
import nutBlue from "@/assets/icons/nut-light-blue.svg";

//Icons Works
import hiw1 from "@/assets/hiw/hiw-1.svg";
import hiw2 from "@/assets/hiw/hiw-2.svg";
import hiw3 from "@/assets/hiw/hiw-3.svg";
import hiw4 from "@/assets/hiw/hiw-4.svg";
import hiw5 from "@/assets/hiw/hiw-5.svg";
import hiw6 from "@/assets/hiw/hiw-6.svg";

export default function WorksSection() {
  return (
    <section className="works" id="howItWorks">
      <h2 className="title">HOW IT WORKS</h2>

      <Image
        src={nutBlue}
        width={54}
        height={54}
        alt="Nut Light Blue"
        style={{ margin: '40px 0' }}
      />

      <h2 className="yellow">EASY • QUICK • SECURE</h2>
      <h2 className="blue">
        A FRIENDLY AND AUTOMATED WAY TO REACH EXPERTS,
        FIND SOLUTIONS AND HIRING
      </h2>
      <div className="wrapper">
        <div className="col">
          <Image
            src={hiw1}
            width={78}
            height={78}
            alt=""
          />
          <h4 className="title">1. SUBSCRIBE</h4>
        </div>
        <div className="col">
          <Image
            src={hiw2}
            width={78}
            height={78}
            alt=""
          />
          <h4 className="title">2. BROWSE
            CONSULTANTS
            DATABASE</h4>
        </div>
        <div className="col">
          <Image
            src={hiw3}
            width={78}
            height={78}
            alt=""
          />
          <h4 className="title">3. SELECT EXPERTS</h4>
        </div>
        <div className="col">
          <Image
            src={hiw4}
            width={78}
            height={78}
            alt=""
          />
          <h4 className="title">4. VERIFY FITTING
            TO YOUR NEEDS</h4>
        </div>
        <div className="col">
          <Image
            src={hiw5}
            width={78}
            height={78}
            alt=""
          />
          <h4 className="title">5. SCHEDULE
            CONSULTATIONS OR JOB INTERVIEWS</h4>
        </div>
        <div className="col">
          <Image
            src={hiw6}
            width={160}
            height={79}
            alt=""
          />
          <h4 className="title">6. TALK TO EXPERTS
            & PAY</h4>
        </div>
      </div>
    </section>
  );
}