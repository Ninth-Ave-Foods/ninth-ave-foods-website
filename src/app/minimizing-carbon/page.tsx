import config from "@/config/config.json";
import { markdownify } from "@/lib/utils/textConverter";
import Image from "next/image";
import ExpandableImage from "@/components/ExpandableImage";
import { getListPage } from "@/lib/contentParser";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import CallToAction from "@/partials/CallToAction";
import Button from "@/shortcodes/Button";
import BulletPoints from "@/partials/BulletPoints";
import SustainabilityPillars from "@/partials/SustainabilityPillars";
import HighlightBanner from "@/partials/HighlightBanner";
import { HighlightBannerProps, HighlightSectionProps } from "@/types";
import HighlightSection from "@/partials/HighlightSection";

const { minimizing_carbon_folder } = config.settings;

interface Frontmatter {
  title: string;
  subtitle: string;
  meta_title: string;
  description: string;
  page_header_image: string;
  vision_title: string;
  vision_content: string;
  vision_content2: string;
  policy_title: string;
  policy_content: string;
  policy_bulletpoints: string[];
  policy_content2: string;
  policy_content3: string;
  highlight_banner: HighlightBannerProps;
  highlights_section: HighlightSectionProps[];
  infographic: string;
}

const MinimizingCarbon = () => {
  const data = getListPage(`${minimizing_carbon_folder}/_index.md`);

  // Then you can do:
  const {
    title,
    subtitle,
    meta_title,
    description,
    page_header_image,
    vision_title,
    vision_content,
    vision_content2,
    policy_title,
    policy_content,
    policy_bulletpoints,
    policy_content2,
    policy_content3,
    highlight_banner,
    highlights_section,
    infographic,
  } = data.frontmatter as Frontmatter;

  const callToAction = getListPage("sections/call-to-action.md");
  const sustainabilityPillars = getListPage(
    "sections/sustainability-pillars.md",
  );

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
      />
      <PageHeader
        title={title}
        subtitle={subtitle}
        image={page_header_image}
        variant="minimalOverlay"
      />
      <section className="section-sm">
        <div className="container pb-14 text-dark-grey font-secondary tracking-wide">
          <p
            className="pb-2 text-lime-green text-2xl leading-loose"
            dangerouslySetInnerHTML={markdownify(vision_title)}
          />

          <p
            className="text-xl md:col-8 leading-relaxed"
            dangerouslySetInnerHTML={markdownify(vision_content)}
          />

          <div className="grid md:grid-cols-2 py-10 mx-auto gap-14">
            <div className="col-span-1 flex flex-col justify-center leading-loose col-10 pt-12">
              <div className="flex flex-row items-center pb-16">
                <svg
                  className="text-dark-grey w-16 h-6 flex-shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="22 0 26 26"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                    d="M50 12H2m50 0-4 4m4-4-4-4"
                  />
                </svg>
                <h4 className="text-dark-grey font-bold font-primary">
                  Unmatched Efficiency
                </h4>
              </div>

              <p
                className="text-xl leading-relaxed"
                dangerouslySetInnerHTML={markdownify(vision_content2)}
              />
            </div>

            <div className="w-[500px] md:h-[600px] col-span-1">
              <Image
                src="/images/gallery/ninth-ave-10.jpg"
                alt="Image header"
                className="w-full h-full object-cover rounded-xs"
                width={2150}
                height={1400}
              />
            </div>
          </div>
          <div className="py-14">
            <HighlightSection highlights={highlights_section} />
          </div>
        </div>
        <SustainabilityPillars
          data={sustainabilityPillars}
        ></SustainabilityPillars>

        <div className="container py-14">
          <Image
            src={infographic}
            alt="2024 Performance at a glance inforgraphic"
            width={1418}
            height={1000}
            className="pb-14"
          />
        </div>

        <CallToAction data={callToAction}></CallToAction>
      </section>
    </>
  );
};

export default MinimizingCarbon;
