"use client";

interface HeadingProps {
  title: string;
  description: string;
  keyword: string;
}

const Heading = ({ title, description, keyword }: HeadingProps) => {
  return (
    <div>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keyword} />
    </div>
  );
};

export default Heading;
