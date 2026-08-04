"use client";

import { markdownify } from "@/lib/utils/textConverter";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { HiringAnnouncementFrontmatter } from "@/types";

interface PageData {
  notFound?: boolean;
  content?: string;
  frontmatter: HiringAnnouncementFrontmatter;
}

const HiringAnnouncement = ({ data }: { data: PageData }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0,
  });

  const { title, description, dateLabel, enable = true } = data.frontmatter;

  if (!enable) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="container" ref={ref}>
        <div
          className={`rounded-xl border border-primary/40 bg-primary/5 px-6 py-8 md:px-10 ${
            inView
              ? "animate-fade animate-duration-[500ms] animate-delay-[300ms]"
              : ""
          }`}
        >
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary/15">
              <Image
                src="/images/career/texas-icon.svg"
                alt="Texas"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>

            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h2
                  dangerouslySetInnerHTML={markdownify(title)}
                  className="text-h5 font-semibold text-dark"
                />

                {dateLabel && (
                  <span className="rounded-md bg-primary/15 px-3 py-1 text-sm font-semibold uppercase text-primary">
                    {dateLabel}
                  </span>
                )}
              </div>

              <div
                dangerouslySetInnerHTML={markdownify(description)}
                className="max-w-3xl text-base leading-7 text-dark-grey md:text-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HiringAnnouncement;
