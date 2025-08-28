"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { humanize } from "@/lib/utils/textConverter";
import Image from "next/image";
import { markdownify } from "@/lib/utils/textConverter";

const PageHeader = ({
  title,
  subtitle,
  image,
  variant = "default",
}: {
  title: string;
  subtitle?: string;
  image?: string;
  variant?: "default" | "overlayTextBox" | "minimalOverlay";
}) => {
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll effect for parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const parallaxStyle = {
    transform: `translateY(${scrollY * 0.6}px)`,
  };

  return (
    <section className="relative">
      {variant === "default" && (
        <div className="container text-center pt-8">
          <div
            className={`relative rounded-2xl px-8 py-14 overflow-hidden ${
              image ? "" : "bg-gradient-to-b from-light-green to-theme-light"
            }`}
          >
            {/* Parallax Image */}
            {image && (
              <div
                className="absolute inset-0 w-full h-full"
                style={{ zIndex: -1 }}
              >
                <Image
                  src={image}
                  alt="Image header"
                  fill
                  style={parallaxStyle}
                  blurDataURL="/images/image-placeholder.png"
                  className="object-cover w-full h-auto"
                  priority // Preload the image
                  quality={80} // Adjust image quality for performance
                  sizes="(min-width: 1400px) 1286px, 93.8vw"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-black/45 to-black/10"
                  style={{ zIndex: 0 }}
                />
              </div>
            )}

            {/* Title, Subtitle, and Breadcrumbs */}

            <div className="relative">
              <h1 className={`${image ? "text-white" : "text-dark-grey"}`}>
                {humanize(title)}
              </h1>
              <p
                className={`sm:text-xl sm:col-7 mx-auto ${
                  image ? "text-white" : "text-dark-grey"
                }`}
              >
                {subtitle ? humanize(subtitle) : ""}
              </p>
              <Breadcrumbs
                className={`mt-6 text-lg ${
                  image ? "text-white" : "text-dark-grey"
                }`}
                spanClassName={`${image ? "text-white" : "text-primary"}`}
              />
            </div>
          </div>
        </div>
      )}

      {variant === "overlayTextBox" && (
        <div className=" text-center">
          <div
            className={`relative px-8 py-14 overflow-hidden min-h-[600px] ${
              image ? "" : "bg-gradient-to-b from-light-green to-theme-light"
            }`}
          >
            {/* Parallax Image */}
            {image && (
              <div
                className="absolute inset-0 w-full h-full"
                style={{ zIndex: -1 }}
              >
                <Image
                  src={image}
                  alt="Image header"
                  fill
                  style={parallaxStyle}
                  blurDataURL="/images/image-placeholder.png"
                  className="object-cover w-full h-auto object-bottom brightness-10"
                  priority // Preload the image
                  quality={90} // Adjust image quality for performance
                  sizes="(min-width: 2000px) 1500px, 93.8vw"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/10"
                  style={{ zIndex: 0 }}
                />
              </div>
            )}
            <div className="relative">
              <div className="absolute left-[510px] top-28 hidden md:block">
                <Image
                  src="/images/sustainability/planet-earth.png"
                  alt="Ninth Ave Foods Warehouse"
                  className="w-[150px] h-[150px]"
                  width={300}
                  height={300}
                />
              </div>
              <div className="flex flex-col justify-start text-left md:mx-10">
                <h2
                  className={`text-h2 lg:text-h1 ${image ? "text-white" : "text-dark-grey"} `}
                  dangerouslySetInnerHTML={markdownify(title ? title : "")}
                />

                <p
                  className={`sm:text-xl bg-primary md:w-[570px] rounded-xs p-14 ${
                    image ? "text-white" : "text-dark-grey"
                  }`}
                  dangerouslySetInnerHTML={markdownify(
                    subtitle ? subtitle : "",
                  )}
                />
              </div>

              <Breadcrumbs
                className={`mt-6 text-lg ${
                  image ? "text-white" : "text-dark-grey"
                }`}
                spanClassName={`${image ? "text-white" : "text-primary"}`}
              />
            </div>
          </div>
        </div>
      )}

      {variant === "minimalOverlay" && (
        <div className=" text-center">
          <div
            className={`relative px-8 py-14 overflow-hidden md:min-h-[750px]  min-h-[400px] ${
              image ? "" : "bg-gradient-to-b from-light-green to-theme-light"
            }`}
          >
            {/* Parallax Image */}
            {image && (
              <div
                className="absolute inset-0 w-full h-full"
                style={{ zIndex: -1 }}
              >
                <Image
                  src={image}
                  style={parallaxStyle}
                  alt="Image header"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover w-full h-auto object-bottom brightness-10"
                />

                <div
                  className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/30"
                  style={{ zIndex: 0 }}
                />
              </div>
            )}
            <div className="relative item">
              <div className="absolute top-24 md:top-64 right-0 flex flex-col items-end text-right">
                <h2
                  className={`text-h2 lg:text-h1 md:w-[750px] text-right md:pr-8 ${image ? "text-white" : "text-dark-grey"}`}
                  dangerouslySetInnerHTML={markdownify(title ? title : "")}
                />

                <p
                  className={`sm:text-xl bg-primary rounded-xs p-3 text-right md:max-w-[960px] ${
                    image ? "text-white" : "text-dark-grey"
                  }`}
                  dangerouslySetInnerHTML={markdownify(
                    subtitle ? subtitle : "",
                  )}
                />
                <Breadcrumbs
                  className={`relative mt-6 text-lg  ${
                    image ? "text-white" : "text-dark-grey"
                  }`}
                  spanClassName={`${image ? "text-white" : "text-primary"}`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PageHeader;
