"use client";
import { Carousel } from "react-bootstrap";
import banner1 from "@/assets/banners/banner-1.jpg";
import banner2 from "@/assets/banners/banner-2.jpg";
import banner3 from "@/assets/banners/banner-3.jpg";

export default function HomeCarousel() {
  return (
    <Carousel>
      <Carousel.Item>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="d-block w-100"
          src={banner1.src}
          alt="Banner-1"
        />
        <div className="carousel-item-item">
          <h2>
            EXPERTS AT HAND<br />
            RIGHT WHEN YOU NEED THEM
          </h2>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="d-block w-100"
          src={banner2.src}
          alt="Banner-2"
        />
        <div className="carousel-item-item">
          <h2>
            A SPACE FOR KNOWLEDGE<br />
            AN OPPORTUNITY FOR YOU
          </h2>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="d-block w-100"
          src={banner3.src}
          alt="Banner-3"
        />
        <div className="carousel-item-item">
          <h2>
            AUTOMATED PROCESS<br />
            AND COMMUNICATION PLATFORMS
          </h2>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}