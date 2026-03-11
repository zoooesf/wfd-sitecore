export const SimplePageTitle: React.FC<SimplePageTitleType> = ({ heading }) => {
  return <span className="disabled hidden md:block">{heading}</span>;
};

type SimplePageTitleType = {
  heading: string;
};

export default SimplePageTitle;
