"use client";

import Image from "next/image";
import { markdownify } from "@/lib/utils/textConverter";
import { useInView } from "react-intersection-observer";
import { Capability } from "@/types";
import ExpandableImage from "./ExpandableImage";
import BulletPoints from "@/partials/BulletPoints";

interface PageData {
  frontmatter: {
    capabilities: Array<Capability>;
  };
}

const Capabilities = ({ data }: { data: PageData }) => {
  const { ref: ref1, inView: inView1 } = useInView({
    triggerOnce: true,
    threshold: 0, // Adjust as needed
  });
  const { ref: ref2, inView: inView2 } = useInView({
    triggerOnce: true,
    threshold: 0, // Adjust as needed
  });

  return (
    <div
      ref={ref1}
      className={`${inView1 ? "animate-fade-up animate-duration-[500ms] animate-delay-[400ms] px-10" : ""}`}
    >
      {data.frontmatter.capabilities.map((capability: Capability, index) => (
        <section className="w-full flex justify-center" key={index}>
          <div className="container mx-auto flex justify-center">
            <div className="w-full md:w-5/6 lg:w-[950px]">
              <div className="row pb-14">
                <div
                  className={`relative flex md:flex-row flex-col items-center bg-white top-2 lg:px-14 lg:py-14 md:px-10 md:py-10 py-5 rounded-sm shadow-xl ${index === 1 ? "xl:left-24" : "xl:right-24"}`}
                >
                  {/* Left Image */}
                  {index !== 1 && (
                    <div
                      ref={ref2}
                      className="flex flex-col items-center md:w-[400px] mb-5 md:mb-0"
                    >
                      <ExpandableImage
                        className={`md:rounded-full rounded-sm lg:w-80 lg:h-80 md:w-60 md:h-60 w-[400px] mb-5 object-cover shadow-lg ${inView2 ? "animate-fade-right animate-ease-linear" : ""}`}
                        src={capability.image}
                        alt={capability.alt}
                        width={650}
                        height={399}
                      />
                    </div>
                  )}
                  {/* Content */}
                  <div className="items-center lg:px-8 px-2 w-full md:w-auto">
                    <div className="flex flex-col md:items-center items-start pb-2">
                      <h5
                        className="text-dark-green font-light tracking-widest pb-2"
                        dangerouslySetInnerHTML={markdownify(capability.title)}
                      />
                    </div>
                    <BulletPoints bulletpoints={capability.bulletpoints} />
                  </div>

                  {/* Right Image */}
                  {index === 1 && (
                    <div className="flex flex-col items-center md:w-[400px]">
                      <ExpandableImage
                        className={`md:rounded-full rounded-sm lg:w-80 lg:h-80 md:w-60 md:h-60 w-[400px] object-cover shadow-lg ${inView1 ? "animate-fade-right animate-ease-linear animate-delay-[1300ms]" : ""}`}
                        src={capability.image}
                        alt={capability.alt}
                        width={650}
                        height={399}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Capabilities;
