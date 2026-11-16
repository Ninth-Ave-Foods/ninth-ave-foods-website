import config from "@/config/config.json";
import { markdownify } from "@/lib/utils/textConverter";
import { getListPage } from "@/lib/contentParser";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import CarrierForm from "@/components/CarrierForm";

const CarrierInquiries = () => {
  const data = getListPage("carrier/_index.md");
  const point_of_contact = getListPage("sections/points-of-contact.md");

  const { frontmatter } = data;
  const {
    title,
    description,
    meta_title,
    image,
    page_header_image,
    carrier_title,
    carrier_content,
  } = frontmatter;
  const { contact_form_action } = config.params;

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
        image={image}
      />
      <PageHeader
        title={title}
        subtitle="Submit your company details to our logistics team"
        image={page_header_image}
      />
      <section className="section-sm">
        <div className="container tracking-wide font-secondary">
          <CarrierForm></CarrierForm>
        </div>
      </section>
    </>
  );
};

export default CarrierInquiries;
