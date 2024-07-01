import { slug } from "github-slugger";
import { marked } from "marked";

// slugify
export const slugify = (content: string) => {
  return slug(content);
};

export const decodeSlugify = (content: string) => {
  var replaceDash = content.replaceAll("-", " ");
  var capitialize = replaceDash.replace(/\b./g, function (m) {
    return m.toUpperCase();
  });
  return capitialize;
};

// markdownify
export const markdownify = (content: string, div?: boolean) => {
  if (typeof content !== "string") {
    console.error("Invalid content type, expected a string");
    return { __html: "" };
  }

  // Parse the content and apply styles based on underscores
  content = content.replace(
    /__(.*?)__/g,
    '<span style="color:#0d7e08">$1</span>',
  );

  // Replace the content new lines with <br> tags to preserve line breaks
  content = content.replace(/\n/g, "<br>");

  // Replace the content italicized text with <i> tags
  content = content.replace(/<i>(.*?)<i>/g, "<i>$1</i>");

  const markdownContent: any = div
    ? marked.parse(content)
    : marked.parseInline(content);
  return { __html: markdownContent };
};

// humanize
export const humanize = (content: string) => {
  if (typeof content !== "string") {
    console.error("Invalid content type, expected a string");
    return "";
  }

  return content
    .replace(/^[\s_]+|[\s_]+$/g, "")
    .replace(/[_\s]+/g, " ")
    .replace(/^[a-z]/, function (m) {
      return m.toUpperCase();
    });
};

// titleify
export const titleify = (content: string) => {
  const humanized = humanize(content);
  return humanized
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// plainify
export const plainify = (content: string) => {
  if (typeof content !== "string") {
    console.error("Invalid content type, expected a string");
    return "";
  }

  const parseMarkdown: any = marked.parse(content);
  const filterBrackets = parseMarkdown.replace(/<\/?[^>]+(>|$)/gm, "");
  const filterSpaces = filterBrackets.replace(/[\r\n]\s*[\r\n]/gm, "");
  const stripHTML = htmlEntityDecoder(filterSpaces);
  return stripHTML;
};

// strip entities for plainify
const htmlEntityDecoder = (htmlWithEntities: string): string => {
  let entityList: { [key: string]: string } = {
    "&nbsp;": " ",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
  };
  let htmlWithoutEntities: string = htmlWithEntities.replace(
    /(&amp;|&lt;|&gt;|&quot;|&#39;)/g,
    (entity: string): string => {
      return entityList[entity];
    },
  );
  return htmlWithoutEntities;
};
