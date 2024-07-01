import { PortableTextBlock } from "sanity";

export type RegularPage = {
  frontmatter: {
    title: string;
    subtitle?: string;
    image?: string;
    description?: string;
    meta_title?: string;
    layout?: string;
    draft?: boolean;
  };
  content: string;
  slug?: string;
};

export type Post = {
  frontmatter: {
    title: string;
    meta_title?: string;
    description?: string;
    image?: string;
    categories: string[];
    author: string;
    tags: string[];
    date?: string;
    draft?: boolean;
  };
  slug?: string;
  content?: string;
};

export type Author = {
  frontmatter: {
    title: string;
    image?: string;
    description?: string;
    meta_title?: string;
    social: [
      {
        name: string;
        icon: string;
        link: string;
      },
    ];
  };
  content?: string;
  slug?: string;
};

export type Feature = {
  button: button;
  image?: string;
  video?: string;
  bulletpoints?: string[];
  content: string;
  title: string;
  subtitle?: string;
};

export type Testimonial = {
  name: string;
  designation: string;
  avatar: string;
  content: string;
};

export type Service = {
  image: string;
  alt: string;
  link: string;
  title: string;
  content: string;
  button: Button;
};

export type Photo = {
  src: string;
  width: number;
  height: number;
};

export type Product = {
  image: string;
  title: string;
  alt: string;
  height: string;
  width: string;
};

export type Plant_based = {
  enable?: boolean;
  title: string;
  description: string;
  image: string;
  button: Button;
};

export type Call_to_action = {
  enable?: boolean;
  title: string;
  description: string;
  image: string;
  button: Button;
};

export type Button = {
  enable: boolean;
  label: string;
  link: string;
};

export type Buttons = {
  [key: string]: {
    enable: boolean;
    label: string;
    link: string;
    classname: string;
  };
};

export type Point_of_contact_email = {
  title: string;
  content: string;
  email: string;
  href: string;
};

export type Location = {
  state: string;
  address: string;
};

export type Point_of_contact_locations = {
  title: string;
  locations: Location[];
};

export type Number = {
  state: string;
  phone_number: string;
  href: string;
};

export type Point_of_contact_call = {
  title: string;
  content: string;
  numbers: Number[];
};

export type Capability = {
  title: string;
  image: string;
  alt: string;
  bulletpoints: string[];
};

export type Card = {
  title: string;
  content: string;
  button: Button;
};

export type ProfileType = {
  _id: string;
  fullName: string;
  headline: string;
  profileImage: {
    alt: string;
    image: string;
  };
  shortBio: string;
  email: string;
  fullBio: PortableTextBlock[];
  location: string;
  resumeURL: string;
  socialLinks: string[];
  skills: string[];
};

export type JobPosition = {
  _id: string;
  jobTitle: string;
  location: string;
};

export type User = {
  _type: string;
  name: string;
  email: string;
  message: string;
};

export type EmployeeApplication = {
  _id?: string;
  _type: string;
  dateOfApplication: string;
  fname: string;
  mname: string;
  lname: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
  email: string;
  positions: string;
  employeeType: string;
  availability: Array<string>;
  weekendAvailability: string;
  overtime: string;
  startDate: string;
  accommodation: string;
  accommodationMessage: string;
  jobPositionID: string;
  jobPosition: string;
};
