"use client";
import Image from "next/image";
import { HighlightBannerProps } from "@/types";
import { markdownify } from "@/lib/utils/textConverter";
import { useInView } from "react-intersection-observer";

const HighlightBanner = ({ data }: { data: HighlightBannerProps }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0, // Adjust as needed
  });

  return (
    <div className="py-8 bg-primary w-full" ref={ref}>
      <div className="flex flex-row items-center justify-center">
        {data.logo && (
          <div className="hidden lg:block relative lg:left-10 xl:left-40 mr-10 max-w-[150px]">
            <Image height={200} width={200} src={data.logo} alt="Logo" />
          </div>
        )}

        <div className="flex flex-col items-center">
          <h2
            dangerouslySetInnerHTML={markdownify(data.title)}
            className={`mb-6 text-white xl:col-9 col-10 ${
              inView ? "animate-fade animate-duration-[600ms] ease-in" : ""
            }`}
          />
          <p
            className={`text-white text-xl xl:col-9 col-10 ${
              inView ? "animate-fade animate-delay-[200ms] ease-in" : ""
            }`}
            dangerouslySetInnerHTML={markdownify(data.subtitle)}
          />

          <div
            className={`flex flex-col pt-4 items-start xl:col-9 col-10 ${
              inView ? "animate-fade animate-delay-[400ms] ease-in" : ""
            }`}
          >
            <p
              className="text-white text-lg"
              dangerouslySetInnerHTML={markdownify(data.detail)}
            />

            {data.enableDownArrow && (
              <Image
                height={50}
                width={50}
                src="/images/down-arrow.png"
                alt="down-arrow"
                className="flex relative h-8 w-8 right-3 mt-4"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightBanner;
