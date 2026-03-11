export type PeoplePageInfo = {
  language: string;
  displayName: string;
};

export type GetPeoplePageDisplayNamePerLanguageQueryResponse = {
  item: {
    id: string;
    path: string;
    languages: {
      language: {
        name: string;
      };
      displayName: string;
    }[];
  };
};
