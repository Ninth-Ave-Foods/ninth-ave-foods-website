"use client";

import Image from "next/image";
import { markdownify } from "@/lib/utils/textConverter";
import { SustainabilityPillar } from "@/types";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

interface PageData {
  frontmatter: {
    enable?: boolean;
    title: string;
    description: string;
    sustainabilityPillars: Array<SustainabilityPillar>;
    link: string;
    label: string;
  };
}

const SustainabilityPillars = ({ data }: { data: PageData }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0,
  });

  const isThreePillars = data.frontmatter.sustainabilityPillars.length === 3;
  const xlGridCols = isThreePillars ? "xl:grid-cols-3" : "xl:grid-cols-4";

  const rendersustainabilityPillarCard = (
    sustainabilityPillar: SustainabilityPillar,
    index: number,
  ) => (
    <div
      className={`relative text-center ${
        inView
          ? `animate-fade-up animate-duration-[500ms] animate-delay-[${
              400 + (index + 1) * 50
            }ms]`
          : ""
      }`}
      key={index}
    >
      <div
        className={`w-full md:h-[400px] h-[350px] max-w-[300px] md:min-w-[300px] md:max-w-[500px] rounded-sm bg-white flex flex-col justify-center items-center mx-auto p-4`}
      >
        <Image
          src={sustainabilityPillar.logo}
          alt={sustainabilityPillar.alt}
          width={50}
          height={50}
          className="w-12 h-12"
        />

        {/* Content Container */}
        <h5
          dangerouslySetInnerHTML={markdownify(sustainabilityPillar.title)}
          className="text-xl font-bold text-dark-grey my-4"
        />
        <blockquote
          className="text-dark-grey text-lg leading-relaxed mx-6"
          dangerouslySetInnerHTML={markdownify(sustainabilityPillar.content)}
        />
        {sustainabilityPillar.button.enable && (
          <Link
            className="btn btn-transparent rounded-md text-dark-grey my-3 inline-block mx-auto hover:text-primary"
            href={sustainabilityPillar.button.link}
          >
            <div className="flex flex-row items-center justify-center text-lg">
              {sustainabilityPillar.button.label}
              <svg
                className="ml-1"
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
            </div>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {data.frontmatter.enable && (
        <section className="section-sm bg-theme-light">
          <div className="xl:px-0 px-4 max-w-screen-xl mx-auto">
            <div className="flex flex-col text-centercol-10">
              <h2
                dangerouslySetInnerHTML={markdownify(data.frontmatter.title)}
                className="text-dark-grey md:text-3xl text-h3 pb-8 font-primary mx-auto col-12"
              />
              {data.frontmatter.description && (
                <p
                  dangerouslySetInnerHTML={markdownify(
                    data.frontmatter.description!,
                  )}
                />
              )}
            </div>

            <div
              ref={ref}
              className="flex flex-col md:flex-row items-center justify-center"
            >
              <div
                className={`grid grid-cols-1 md:grid-cols-2 ${xlGridCols} gap-6`}
              >
                {data.frontmatter.sustainabilityPillars.map(
                  rendersustainabilityPillarCard,
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default SustainabilityPillars;
