import config from "@/config/config.json";
import { markdownify } from "@/lib/utils/textConverter";
import Image from "next/image";
import { getListPage } from "@/lib/contentParser";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import CallToAction from "@/partials/CallToAction";
import SustainabilityPillars from "@/partials/SustainabilityPillars";
import HighlightBanner from "@/partials/HighlightBanner";
import { HighlightSectionProps, HighlightBannerProps } from "@/types";
import HighlightSection from "@/partials/HighlightSection";
import ExpandableImage from "@/components/ExpandableImage";

const { circular_economy_folder } = config.settings;

interface Frontmatter {
  title: string;
  subtitle: string;
  meta_title: string;
  description: string;
  page_header_image: string;
  vision_title: string;
  vision_content: string;
  vision_content2: string;
  vision_image: string;
  highlight_banner: HighlightBannerProps;
  highlights_section: HighlightSectionProps[];
  inforgraphic_title: string;
  infographic: string;
  infographic_alt: string;
}

const CircularEconomy = () => {
  const data = getListPage(`${circular_economy_folder}/_index.md`);

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
    vision_image,
    highlights_section,
    highlight_banner,
    inforgraphic_title,
    infographic,
    infographic_alt,
  } = data.frontmatter as Frontmatter;

  const callToAction = getListPage("sections/call-to-action.md");
  const sustainabilityPillars = getListPage(
    "sections/sustainability-four-pillars.md",
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
          <div className="grid md:grid-cols-2 py-10 mx-auto lg:gap-14 gap-5">
            <div className="col-span-1 flex flex-col justify-center leading-loose">
              <p
                className="pb-4 text-xl text-lime-green leading-loose animate-fade animate-duration-[600ms]"
                dangerouslySetInnerHTML={markdownify(vision_title)}
              />
              <h5
                className="leading-relaxed text-dark-grey pb-5 lg:pb-14 tracking-wide animate-fade animate-duration-[600ms] animate-delay-[100ms]"
                dangerouslySetInnerHTML={markdownify(vision_content)}
              />
              <p
                className="text-xl leading-relaxed animate-fade animate-duration-[600ms] animate-delay-[200ms]"
                dangerouslySetInnerHTML={markdownify(vision_content2)}
              />
            </div>

            <div className="h-[350px] md:h-full lg:w-[473px] lg:h-[600px] col-span-1 animate-fade animate-duration-[600ms] animate-delay-[300ms]">
              <Image
                src={vision_image}
                alt="Image header"
                className="w-full h-full object-cover object-top rounded-xs"
                width={2150}
                height={1400}
              />
            </div>
          </div>
        </div>
        <HighlightBanner data={highlight_banner} />

        <div className="container py-14 md:col-7 animate-fade animate-duration-[600ms] animate-delay-[500ms]">
          <ExpandableImage
            src={infographic}
            alt={infographic_alt}
            width={4500}
            height={1100}
            className="w-full h-auto"
            priority
          />
        </div>

        <div className="pb-24">
          <SustainabilityPillars
            data={sustainabilityPillars}
          ></SustainabilityPillars>
        </div>

        <CallToAction data={callToAction}></CallToAction>
      </section>
    </>
  );
};

export default CircularEconomy;
