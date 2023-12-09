"use client";

import Link from "next/link";
import Image from "next/image";
import { Col, Row } from "react-bootstrap";
import tripleNuts from "@/assets/logos-ext/triple-nuts.svg";
import linkedin from "@/assets/logos-ext/linkedin.svg";
import facebook from "@/assets/logos-ext/facebook.svg";
import instagram from "@/assets/logos-ext/instagram.svg";

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <Row className="justify-content-space-between">
          <Col xs={12} md={5} className="mb-3 mb-md-0">
            <Row className="h-100">
              <Col
                className="d-flex flex-column align-items-end justify-content-center"
                style={{
                  borderRightWidth: 1,
                  borderRightStyle: "solid",
                  borderRightColor: "white",
                }}
              >
                <Link href="/clients/login" className="footer-link">
                  Subscription T&C
                </Link>
                <Link href="/clients/login" className="footer-link">
                  Consultants T&C
                </Link>
              </Col>
              <Col
                className="d-flex flex-column justify-content-center"
              >
                <Link href="/clients/login" className="footer-link">
                  Privacy Policy
                </Link>
                <Link href="/clients/login" className="footer-link">
                  FAQ
                </Link>
              </Col>
            </Row>
          </Col>
          <Col xs={12} md={2} className="d-flex flex-column align-items-center mb-3 mb-md-0">
            <Image
              src={tripleNuts}
              width={64}
              height={64}
              alt="Tripe nuts"
            />
          </Col>
          <Col xs={12} md={5} className="d-flex align-items-center justify-content-center mb-3 mb-md-0">
            <Link href="">
              <Image
                className="m-1"
                src={linkedin}
                width={42}
                height={42}
                alt="Linkedin"
              />
              <Image
                className="m-1"
                src={facebook}
                width={42}
                height={42}
                alt="Facebook"
              />
              <Image
                className="m-1"
                src={instagram}
                width={42}
                height={42}
                alt="Instagram"
              />
            </Link>
          </Col>
        </Row>
      </div>
      <div className="footer-bottom" />
    </footer>
  );
}