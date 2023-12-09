import Image from "next/image";
import Link from "next/link";
import nut from "@/assets/icons/nut-dark-blue.svg";
import nutBlue from "@/assets/icons/nut-light-blue.svg";

import { Space } from "antd";

function Friendly() {
    return (
        <section className="friendly" id="friendly">
            <h2 className="title">
                FRIENDLY SERVICE TO CONTACT EXPERTS
            </h2>

            <Image
                src={nut}
                width={54}
                height={54}
                alt="Nut Light Blue"
                style={{ margin: '40px 0' }}
            />

            <ul className="flex flex-col justify-center items-center gap-4 py-8">
                <li>A new world: technologies and remote work</li>
                <li>New consultancy needs find a communication channel</li>
                <li>
                    Shortage of talent and growing need to reach experts anytime, anywhere
                </li>
                <li>
                    Paying for experts to traditional consultancy companies is very expensive
                </li>
                <li>Fades out the connection gap between academic communities and experts worldwide</li>
            </ul>

            <h2 className="subtitle my-8">
                SAVE <span>VALUABLE</span> TIME AND MONEY
            </h2>

            <div className="flex justify-center items-center flex-wrap gap-4 mt-2 mb-10">
                <Link href=""
                    className=" py-3 px-4 bg-blueObs text-white">
                    BROWSE CONSULTANTS
                </Link>
                <Link href=""
                    className=" py-3 px-4 bg-blueObs text-white">
                    BECOME A CONSULTANT
                </Link>
                <Link href=""
                    className=" py-3 px-4 bg-blueObs text-white">
                    CLICK AND SUBSCRIBE
                </Link>
            </div>

            <div className="become">
                <h2>¿INTERESTED IN BECOMING A CONSULTANT?</h2>
            </div>

            <Image
                src={nutBlue}
                width={54}
                height={54}
                alt="Nut Light Blue"
                style={{ margin: '40px 0' }}
            />

            <h2 className="subtitle my-8">
                REGISTER AND ENJOY THE BENEFITS
            </h2>

            <ul className="flex items-center justify-center gap-4 py-8 flex-wrap max-w-xl text-center">
                <li>International visibility</li>
                <li>Manage your time and schedule </li>
                <li>System-suggested consultancy rates</li>
                <li>Quick and easy payment</li>
                <li>Add Academic sector to your portfolio</li>
                <li className="font-bold">Free registration</li>
            </ul>

            <div className="mt-4 mb-24">
                <Link href="/"
                    className=" py-3 px-4 bg-blueObs text-white">
                    BROWSE CONSULTANTS
                </Link>
            </div>
        </section>
    );
}

export default Friendly;