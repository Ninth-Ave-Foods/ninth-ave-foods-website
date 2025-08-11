import config from "@/config/config.json";
import { markdownify } from "@/lib/utils/textConverter";
import Image from "next/image";
import { getListPage } from "@/lib/contentParser";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import CallToAction from "@/partials/CallToAction";
import Button from "@/shortcodes/Button";
import BulletPoints from "@/partials/BulletPoints";
import SustainabilityPillars from "@/partials/SustainabilityPillars";

const { sustainability_folder } = config.settings;

const Sustainability = () => {
  const data = getListPage(`${sustainability_folder}/_index.md`);

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
  } = data.frontmatter;

  const callToAction = getListPage("sections/call-to-action.md");
  const services = getListPage("sections/service.md");

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
        <div className="container pb-14 text-dark-grey">
          <h2
            className="pb-2  text-dark-grey"
            dangerouslySetInnerHTML={markdownify(vision_title)}
          />
          <p
            className="text-xl col-8 leading-relaxed"
            dangerouslySetInnerHTML={markdownify(vision_content)}
          />

          <div className="grid grid-cols-2 py-10 mx-auto gap-14">
            <div className="w-full h-[350px] col-span-1">
              <Image
                src="/images/sustainability/images/sustainability-aerial-view-of-factory.jpg"
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
              className="pb-2 text-dark-grey"
              dangerouslySetInnerHTML={markdownify(policy_title)}
            />
            <p
              className="text-xl col-9 leading-relaxed"
              dangerouslySetInnerHTML={markdownify(policy_content)}
            />

            <div className="grid grid-cols-2 gap-8">
              <div className="col-span-1 col-10">
                <div className="pl-14">
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
              <div className="w-full h-[500px] col-span-1">
                <Image
                  src="/images/sustainability/images/sustainability-sustainable.jpg"
                  alt="Image header"
                  className="w-full h-full object-cover rounded-xs"
                  width={2150}
                  height={1400}
                />
              </div>
            </div>
          </div>

          <SustainabilityPillars data={services}></SustainabilityPillars>
        </div>
        <CallToAction data={callToAction}></CallToAction>
      </section>
    </>
  );
};

export default Sustainability;
