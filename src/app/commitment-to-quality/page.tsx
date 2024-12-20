import config from "@/config/config.json";
import { markdownify } from "@/lib/utils/textConverter";
import { getListPage } from "@/lib/contentParser";
import PageHeader from "@/partials/PageHeader";
import Sidebar from "@/partials/SideBar";
import SeoMeta from "@/partials/SeoMeta";
import CallToAction from "@/partials/CallToAction";
import Image from "next/image";
import ExpandableImage from "@/components/ExpandableImage";

const { commitment_to_quality_folder } = config.settings;

const CommitmentToQuality = () => {
  const data = getListPage(`${commitment_to_quality_folder}/_index.md`);

  const {
    title,
    meta_title,
    description,
    image1,
    image2,
    image3,
    cutting_edge_tech_title,
    cutting_edge_tech_content,
    cutting_edge_tech_sub_title,
    cutting_edge_tech_sub_content,
    page_header_image,
  } = data.frontmatter;

  const callToAction = getListPage("sections/call-to-action.md");
  const side_bar = getListPage("sections/side-bar.md");
  const { capabilities, our_services } = side_bar.frontmatter;

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
            <div className="gx-5 grid lg:grid-cols-5 gap-10">
              <div className="lg:col-12 mx-1 col-span-3">
                <div className="row">
                  <div className="relative">
                    <h2
                      className="col-11 text-primary pb-2 text-h3 lg:text-h1 animate-fade animate-duration-[600ms] ease-in"
                      dangerouslySetInnerHTML={markdownify(
                        cutting_edge_tech_title,
                      )}
                    />
                    <p
                      className="text-lg animate-fade animate-delay-[200ms] ease-in"
                      dangerouslySetInnerHTML={markdownify(
                        cutting_edge_tech_content,
                      )}
                    />
                  </div>
                  <div className="mx-auto py-8 md:px-4 animate-fade animate-delay-[300ms] ease-in px-4">
                    <div className="relative flex sm:flex-row flex-col gap-1">
                      {/* Left image */}
                      <div className="flex sm:w-1/2">
                        <ExpandableImage
                          src={image1}
                          alt="Ninth Ave Foods Warehouse"
                          className="w-full h-full object-cover rounded-xs"
                          width={650}
                          height={366}
                        />
                      </div>

                      {/* Right column with two stacked images */}
                      <div className="flex flex-col gap-2 sm:w-5/6 mx-auto">
                        <div className="flex-1">
                          <ExpandableImage
                            src={image2}
                            alt="Ninth Ave Foods Warehouse"
                            className="w-full h-full object-cover rounded-xs"
                            width={650}
                            height={366}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <h3
                      className="text-primary font-primary pb-2 animate-fade animate-duration-[600ms]"
                      dangerouslySetInnerHTML={markdownify(
                        cutting_edge_tech_sub_title,
                      )}
                    />
                    <p
                      className="text-lg animate-fade animate-delay-[200ms] ease-in"
                      dangerouslySetInnerHTML={markdownify(
                        cutting_edge_tech_sub_content,
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-2 hidden lg:block xl:pl-24 pl-10">
                <Sidebar
                  side_bar_title={"Capabilities"}
                  categories={capabilities}
                  title={title}
                />
                <Sidebar
                  side_bar_title={"Our Services"}
                  categories={our_services}
                  title={title}
                />
              </div>
            </div>
          </div>
        </div>

        <CallToAction data={callToAction}></CallToAction>
      </section>
    </>
  );
};

export default CommitmentToQuality;
