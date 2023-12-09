import Image from "next/image";
import Link from "next/link";
import nutYellow from "@/assets/icons/nut-yellow.svg";
import expertSelection from "@/assets/img/expert-selection.jpg";

import { Space } from "antd";
import { Button } from "react-bootstrap";


function ConsultantSelection() {
    return (
        <section className="selection">
            <h2 className="title">
                VALUE PROPOSAL
            </h2>

            <Image
                src={nutYellow}
                width={54}
                height={54}
                alt="Nut Light Blue"
                style={{ margin: '40px 0' }}
            />

            <h2 className="subtitle">
                UNPARALLEL <span>ADVANTAGES</span> FOR SUBSCRIBERS
            </h2>

            <div className="wrapper">
                <div className="col-two">
                    <ul>
                        <li>Search engine to access or employ experts</li>
                        <li>Virtual interviews and consultancies</li>
                        <li>Personal dashboard</li>
                        <li>Automatic booking</li>
                        <li>Rates known in advance</li>
                    </ul>
                </div>
                <div className="col-one">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={expertSelection.src} alt="" />
                </div>
            </div>


            <div className="flex justify-center items-center flex-wrap gap-4">
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
        </section>
    );
}

export default ConsultantSelection;