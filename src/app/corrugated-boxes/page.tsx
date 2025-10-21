import MDXContent from "@/helpers/MDXContent";
import config from "@/config/config.json";
import { markdownify } from "@/lib/utils/textConverter";
import { getListPage } from "@/lib/contentParser";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { Card } from "@/types";
import BasicCard from "@/partials/BasicCard";
import CallToAction from "@/partials/CallToAction";
import Image from "next/image";
import Services from "@/partials/Services";

const { corrugated_boxes_folder } = config.settings;

const CorrugatedBoxes = () => {
  const data = getListPage(`${corrugated_boxes_folder}/_index.md`);
  const collaspe_data = getListPage(`${corrugated_boxes_folder}/collapse.md`);

  const {
    title,
    meta_title,
    description,
    image,
    alt,
    sustainability_title,
    sustainability_content,
    sustainability_subcontent_title,
    sustainability_subcontent,
    page_header_image,
  } = data.frontmatter;

  const content = collaspe_data.content;

  const { card }: { card: Card } = data.frontmatter;
  const callToAction = getListPage("sections/call-to-action.md");
  const capabilities = getListPage("sections/sustainability-capabilities.md");

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
      />
      <PageHeader title={title} image={page_header_image} />
      <section className="section-sm">
        <div className="container pb-14">
          <div className="w-full">
            <div className="md:gx-5 grid md:grid-cols-5 md:gap-2 grid-cols-3">
              <div className="lg:col-12 lg:mx-4 mx-1 col-span-3">
                <div className="row">
                  <div className="relative">
                    <h3
                      className="lg:col-9 col-11 text-primary pb-2 text-h3 lg:text-h1 animate-fade animate-duration-[600ms] ease-in"
                      dangerouslySetInnerHTML={markdownify(
                        sustainability_title,
                      )}
                    />
                    <p
                      className="lg:col-10 text-lg animate-fade animate-delay-[200ms] ease-in"
                      dangerouslySetInnerHTML={markdownify(
                        sustainability_content,
                      )}
                    />
                    <h3
                      className="text-primary pt-4 pb-2 text-h3 animate-fade animate-duration-[600ms] ease-in"
                      dangerouslySetInnerHTML={markdownify(
                        sustainability_subcontent_title,
                      )}
                    />
                    <p
                      className="lg:col-10 text-lg animate-fade animate-delay-[200ms] ease-in"
                      dangerouslySetInnerHTML={markdownify(
                        sustainability_subcontent,
                      )}
                    />
                  </div>

                  <div className="w-full block md:hidden pt-4">
                    <Image
                      src={image}
                      alt={alt}
                      className="w-full h-full object-cover rounded-lg"
                      width={2121}
                      height={1413}
                    />
                  </div>

                  <div className="mx-auto pt-8 col-span-2">
                    <BasicCard card={card} />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 w-full lg:pl-10 col-span-3 hidden md:block">
                <Image
                  src={image}
                  alt={alt}
                  className="w-full h-full object-cover rounded-lg"
                  width={2121}
                  height={1413}
                />
              </div>
            </div>
          </div>
        </div>

        <Services data={capabilities}></Services>

        <CallToAction data={callToAction}></CallToAction>
      </section>
    </>
  );
};

export default CorrugatedBoxes;
