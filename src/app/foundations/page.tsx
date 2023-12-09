"use client";
import Image from "next/image";
import nutYellow from "@/assets/icons/nut-yellow.svg";

function page() {
    return (
        <section className="foundations">

            <div className="bg-image">
                <h2>KNOWLEDGE. WISDOM. INSIGHT. CONTACT</h2>
            </div>

            <Image
                src={nutYellow}
                width={54}
                height={54}
                alt="Nut Light Blue"
                style={{ margin: '40px 0' }}
            />

            <ul>
                <li>ROBUST EXPERTS DATA BASE</li>
                <li>PROFESSIONAL CRITERIA TO ANALYZE TECHNICAL AND MANAGERIAL TALENT</li>
                <li>CLIENT AND CONSULTANT ORIENTED INNOVATIVE PROCESS</li>
                <li>REMARKABLE EXPERTISE IN MOST OF THE AVAILABLE CONSULTANT FIELDS</li>
            </ul>

        </section>
    );
}

export default page;