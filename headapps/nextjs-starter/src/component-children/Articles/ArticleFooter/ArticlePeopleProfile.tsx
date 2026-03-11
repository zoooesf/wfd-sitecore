import {
  Text,
  RichText,
  useSitecore,
  NextImage,
  Field,
  ImageField,
  LinkField,
} from '@sitecore-content-sdk/nextjs';

// Define expertise tag interface
interface ExpertiseTag {
  id: string;
  url: string;
  name: string;
  displayName: string;
  fields: {
    Title: {
      value: string;
    };
  };
}

// Define location interface
interface LocationItem {
  id: string;
  url: string;
  name: string;
  displayName: string;
  fields: {
    name: Field<string>;
  };
}

// Actual profile structure from the API
export interface ProfileData {
  id: string;
  url: string;
  name: string;
  displayName: string;
  fields: {
    expertise: ExpertiseTag[];
    lastName: Field<string>;
    firstName: Field<string>;
    email: Field<string>;
    role: Field<string>;
    description: Field<string>;
    location: LocationItem[];
    image: ImageField;
    imageMobile: ImageField;
    company: Field<string>;
    website: LinkField;
    linkedInLink: LinkField;
  };
}

type ArticlePeopleProfileProps = {
  people: ProfileData[];
};

const ArticlePeopleProfile: React.FC<ArticlePeopleProfileProps> = ({ people }) => {
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;
  return (
    <div
      data-component="ArticlePeopleProfile"
      className="flex w-full flex-col gap-6 border-t border-content pt-10"
    >
      {people.map((person, index) => {
        return (
          <div
            key={index}
            className="mt-4 flex w-full flex-col items-center gap-4 first:mt-0 md:flex-row md:items-start"
          >
            {isEditing ||
              (person.fields?.image?.value?.src && (
                <NextImage
                  width={320}
                  height={180}
                  field={person.fields.image}
                  className="aspect-square h-auto w-full object-cover md:h-42 md:w-auto"
                />
              ))}
            <div className="flex flex-col">
              <h3 className="heading-xl text-content">{person.displayName || person.name}</h3>
              <Text className="copy-base text-content" field={person.fields?.role} tag="p" />
              <RichText
                className="richtext line-clamp-4 pt-2 leading-relaxed text-content md:pt-4"
                field={person.fields?.description}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ArticlePeopleProfile;
