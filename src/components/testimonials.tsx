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
      onSlideChange={() => console.log("slide change")}
      onSwiper={swiper => console.log(swiper)}
      pagination={{
        clickable: true,
      }}
      modules={[Pagination]}
    >
      {testimonials.map((testimonial, index) => (
        <SwiperSlide key={index} className="">
          <blockquote>
            <h2 className="mb-8">“{testimonial.quote}”</h2>
            <footer>— {testimonial.author}</footer>
          </blockquote>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
