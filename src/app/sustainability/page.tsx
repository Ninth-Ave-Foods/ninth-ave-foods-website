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

const { sustainability_folder } = config.settings;

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
  policy_title: string;
  policy_content: string;
  policy_bulletpoints: string[];
  policy_content2: string;
  policy_content3: string;
  policy_image: string;
  highlight_banner: HighlightBannerProps;
  highlights_section: HighlightSectionProps[];
  infographic: string;
}

const Sustainability = () => {
  const data = getListPage(`${sustainability_folder}/_index.md`);

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
    policy_title,
    policy_content,
    policy_bulletpoints,
    policy_content2,
    policy_content3,
    policy_image,
    highlight_banner,
    highlights_section,
    infographic,
  } = data.frontmatter as Frontmatter;

  const callToAction = getListPage("sections/call-to-action.md");
  const sustainabilityPillars = getListPage(
    "sections/sustainability-three-pillars.md",
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
        variant="overlayTextBox"
      />
      <section className="section-sm">
        <div className="container pb-14 text-dark-grey tracking-wide">
          <h2
            className="pb-2 text-dark-grey leading-loose"
            dangerouslySetInnerHTML={markdownify(vision_title)}
          />
          <p
            className="text-xl md:col-8 leading-relaxed tracking-wide"
            dangerouslySetInnerHTML={markdownify(vision_content)}
          />

          <div className="grid md:grid-cols-2 py-10 mx-auto gap-14">
            <div className="w-full md:h-[350px] col-span-1">
              <Image
                src={vision_image}
                alt="Image header"
                className="w-full h-full object-cover rounded-xs"
                width={2150}
                height={1400}
              />
            </div>

            <div className="col-span-1 flex flex-col justify-center leading-loose">
              <p
                className="text-lg leading-relaxed"
                dangerouslySetInnerHTML={markdownify(vision_content2)}
              />
            </div>
          </div>

          {/* Policy section */}
          <div className="py-14">
            <h2
              className="pb-2 text-dark-grey tracking-wide"
              dangerouslySetInnerHTML={markdownify(policy_title)}
            />
            <p
              className="text-xl md:col-9 leading-relaxed"
              dangerouslySetInnerHTML={markdownify(policy_content)}
            />

            <div className="grid md:grid-cols-2 gap-8">
              <div className="col-span-1 md:col-10">
                <div className="md:pl-14">
                  <p
                    className="text-lg pt-14 pb-4 leading-relaxed"
                    dangerouslySetInnerHTML={markdownify(policy_content2)}
                  />
                  <BulletPoints bulletpoints={policy_bulletpoints} />
                </div>

                <p
                  className="text-xl py-8 leading-relaxed"
                  dangerouslySetInnerHTML={markdownify(policy_content3)}
                />

                <Button label="Download Full Policy" link="#home" />
              </div>
              <div className="w-full md:h-[500px] col-span-1">
                <Image
                  src={policy_image}
                  alt="Image header"
                  className="w-full h-full object-cover rounded-xs"
                  width={2150}
                  height={1400}
                />
              </div>
            </div>
          </div>
        </div>
        <SustainabilityPillars
          data={sustainabilityPillars}
        ></SustainabilityPillars>
        <HighlightBanner data={highlight_banner} />
        <div className="container py-14">
          <ExpandableImage
            src={infographic}
            alt="2024 Performance at a glance inforgraphic"
            width={1418}
            height={1000}
            className="pb-14"
          />
          <HighlightSection highlights={highlights_section} />
        </div>

        <CallToAction data={callToAction}></CallToAction>
      </section>
    </>
  );
};

export default Sustainability;
