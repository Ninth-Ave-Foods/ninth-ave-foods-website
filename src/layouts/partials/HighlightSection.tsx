"use client";

import { markdownify } from "@/lib/utils/textConverter";
import { useInView } from "react-intersection-observer";
import ExpandableImage from "@/components/ExpandableImage";
import { HighlightSectionProps } from "@/types";
import BulletPoints from "@/partials/BulletPoints";

const HighlightSection = ({
  highlights = [], // default empty array to prevent undefined errors
}: {
  highlights?: HighlightSectionProps[];
}) => {
  const { ref: ref1, inView: inView1 } = useInView({
    triggerOnce: true,
    threshold: 0,
  });

  return (
    <section ref={ref1}>
      <div className="flex flex-col items-center justify-center">
        {highlights.map((highlight: HighlightSectionProps, index) => (
          <div
            key={index}
            className={`w-full pt-20 ${
              inView1
                ? "animate-fade-up animate-duration-[500ms] animate-delay-[400ms]"
                : ""
            }`}
          >
            <div
              className={`flex flex-col lg:flex-row items-center ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse mt-14"
              } md:gap-8 gap-12 items-center`}
            >
              {/* Image */}
              <div className="lg:h-[570px] md:h-[400px] h-[250px] sm:h-[350px] xl:w-5/6 w-full relative bottom-20">
                <h3
                  dangerouslySetInnerHTML={markdownify(highlight.title)}
                  className="mb-8 text-dark-grey font-primary animate-fade animate-duration-[600ms] ease-in"
                />
                <ExpandableImage
                  className="rounded-sm shadow-md"
                  src={highlight.image}
                  fill
                  alt={highlight.alt}
                />
              </div>

              {/* Text */}
              <div className="flex flex-col xl:w-4/5 w-full">
                <p
                  className="pb-6 text-dark-grey text-lg animate-fade animate-delay-[200ms] ease-in"
                  dangerouslySetInnerHTML={markdownify(highlight.content)}
                />
                {highlight.bulletpoints &&
                  highlight.bulletpoints.length > 0 && (
                    <BulletPoints bulletpoints={highlight.bulletpoints} />
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HighlightSection;
