"use client";

import { useInView } from "react-intersection-observer";
import { markdownify } from "@/lib/utils/textConverter";

export type BulletPointsProps = {
  bulletpoints: string[];
};

const BulletPoints = ({ bulletpoints }: BulletPointsProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <ul ref={ref}>
      {bulletpoints.map((bullet, index) => (
        <li
          key={index}
          className={`relative mb-4 pl-8 ${
            inView ? "animate-fade-up" : "opacity-0"
          }`}
          style={{ animationDelay: `${index * 150}ms` }} // stagger effect
        >
          <svg
            className="w-7 h-7 absolute left-0 text-[#65a30d]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M19 12H5m14 0-4 4m4-4-4-4"
            />
          </svg>
          <span
            className="text-lg font-light text-dark-grey"
            dangerouslySetInnerHTML={markdownify(bullet)}
          />
        </li>
      ))}
    </ul>
  );
};

export default BulletPoints;
