"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

type Testimonial = {
  quote: string;
  author: string;
};

type TestimonialsProps = {
  testimonials: Testimonial[];
};

export default function Testimonials({ testimonials = [] }: TestimonialsProps) {
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      pagination={{
        clickable: true,
      }}
      modules={[Pagination]}
      aria-label="Testimonials"
    >
      {testimonials.map((testimonial, index) => (
        <SwiperSlide key={index}>
          <blockquote className="max-w-140 m-auto">
            <h2 className="mb-6 h2-lp">"{testimonial.quote}"</h2>
            <footer>— {testimonial.author}</footer>
          </blockquote>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
