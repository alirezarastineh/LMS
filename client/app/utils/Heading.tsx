"use client";

interface HeadingProps {
  title: string;
  description: string;
  keywords: string;
}

const Heading = ({ title, description, keywords }: HeadingProps) => {
  return (
    <div>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </div>
  );
};

export default Heading;
