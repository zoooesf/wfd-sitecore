import gql from 'graphql-tag';
export const LinkListFieldFragment = gql`
  fragment LinkListFieldFragment on Item {
    links: children(includeTemplateIDs: [$linkTemplateId]) {
      results {
        displayName
        ... on HeaderLink {
          link {
            jsonValue
          }
        }
      }
    }
  }
`;
export const BusinessProfileFragment = gql`
  fragment BusinessProfileFragment on BusinessProfile {
    contentName {
      value
    }
    address {
      value
    }
    email {
      value
    }
    phone {
      value
    }
    hours {
      value
    }
    lat {
      value
    }
    long {
      value
    }
    website {
      jsonValue
    }
    services {
      jsonValue
    }
  }
`;
export const ImageFieldFragment = gql`
  fragment ImageFieldFragment on _Image {
    image {
      jsonValue
    }
    imageMobile {
      jsonValue
    }
  }
`;
export const HeadingFieldFragment = gql`
  fragment HeadingFieldFragment on _Heading {
    heading {
      jsonValue
    }
  }
`;
export const SubheadingFieldFragment = gql`
  fragment SubheadingFieldFragment on _Subheading {
    subheading {
      jsonValue
    }
  }
`;
export const BodyFieldFragment = gql`
  fragment BodyFieldFragment on _Body {
    body {
      jsonValue
    }
  }
`;
export const UrlPathFragment = gql`
  fragment UrlPathFragment on Item {
    url {
      path
    }
  }
`;
export const ArticleCardFieldsFragment = gql`
  fragment ArticleCardFieldsFragment on ArticlePage {
    name
    ...ImageFieldFragment
    ...HeadingFieldFragment
    ...SubheadingFieldFragment
    ...BodyFieldFragment
    ...UrlPathFragment
    datePublished {
      formattedDateValue
    }
    pageCategory {
      jsonValue
    }
    profiles {
      targetItems {
        id
        name
        displayName
      }
    }
  }
  ${ImageFieldFragment}
  ${HeadingFieldFragment}
  ${SubheadingFieldFragment}
  ${BodyFieldFragment}
  ${UrlPathFragment}
`;
export const EventCardFieldsFragment = gql`
  fragment EventCardFieldsFragment on EventPage {
    ...HeadingFieldFragment
    ...SubheadingFieldFragment
    ...UrlPathFragment
    ...ImageFieldFragment
    startDate {
      formattedDateValue
    }
    endDate {
      formattedDateValue
    }
    pageCategory {
      jsonValue
    }
    profiles {
      targetItems {
        id
        name
        displayName
      }
    }
    location {
      value
      jsonValue
    }
    eventTime {
      value
    }
  }
  ${HeadingFieldFragment}
  ${SubheadingFieldFragment}
  ${UrlPathFragment}
  ${ImageFieldFragment}
`;
export const InsightCardFieldsFragment = gql`
  fragment InsightCardFieldsFragment on InsightPage {
    name
    ...ImageFieldFragment
    ...HeadingFieldFragment
    ...SubheadingFieldFragment
    ...BodyFieldFragment
    ...UrlPathFragment
    datePublished {
      formattedDateValue
    }
    pageCategory {
      jsonValue
    }
    profiles {
      targetItems {
        id
        name
        displayName
      }
    }
  }
  ${ImageFieldFragment}
  ${HeadingFieldFragment}
  ${SubheadingFieldFragment}
  ${BodyFieldFragment}
  ${UrlPathFragment}
`;
export const KnowledgeCenterResourceFragment = gql`
  fragment KnowledgeCenterResourceFragment on KnowledgeCenterResource {
    id
    name
    displayName
    language {
      name
    }
    updatedDateTime: field(name: "__Updated") {
      value
    }
    sxaTags {
      targetItems {
        id
        name
        displayName
        ... on Tag {
          title {
            value
          }
        }
      }
    }
    file {
      jsonValue
    }
  }
`;
export const LinkFieldFragment = gql`
  fragment LinkFieldFragment on LinkField {
    jsonValue
  }
`;
export const NewsCardFieldsFragment = gql`
  fragment NewsCardFieldsFragment on NewsPage {
    name
    ...ImageFieldFragment
    ...HeadingFieldFragment
    ...SubheadingFieldFragment
    ...BodyFieldFragment
    ...UrlPathFragment
    datePublished {
      formattedDateValue
    }
    displayDateTime {
      jsonValue
    }
    pageCategory {
      jsonValue
    }
    profiles {
      targetItems {
        id
        name
        displayName
      }
    }
  }
  ${ImageFieldFragment}
  ${HeadingFieldFragment}
  ${SubheadingFieldFragment}
  ${BodyFieldFragment}
  ${UrlPathFragment}
`;
export const PageFieldsFragment = gql`
  fragment PageFieldsFragment on Item {
    id
    name
    displayName
    ...UrlPathFragment
  }
  ${UrlPathFragment}
`;
export const SimplePageListingFragment = gql`
  fragment SimplePageListingFragment on CommonBasePage {
    ...ImageFieldFragment
    ...HeadingFieldFragment
    ...SubheadingFieldFragment
  }
  ${ImageFieldFragment}
  ${HeadingFieldFragment}
  ${SubheadingFieldFragment}
`;
export const RecipeCardFieldsFragment = gql`
  fragment RecipeCardFieldsFragment on RecipePage {
    name
    ...ImageFieldFragment
    ...HeadingFieldFragment
    ...UrlPathFragment
    title {
      jsonValue
    }
    prepTime {
      jsonValue
    }
    cookTime {
      jsonValue
    }
  }
  ${ImageFieldFragment}
  ${HeadingFieldFragment}
  ${UrlPathFragment}
`;
export const TagsDetailsFragment = gql`
  fragment TagsDetailsFragment on CommonBasePage {
    sxaTags {
      targetItems {
        name
        id
        displayName
        ... on Tag {
          title {
            value
          }
        }
      }
    }
  }
`;
export const GetArticleListing = gql`
  query GetArticleListing(
    $pageID: String!
    $language: String!
    $endCursor: String
    $first: Int = 5
    $templateId: String!
    $sortOrder: OrderByDirection = DESC
  ) {
    search(
      where: {
        AND: [
          { name: "_templates", value: $templateId, operator: CONTAINS }
          { name: "_path", value: $pageID, operator: CONTAINS }
          { name: "_language", value: $language, operator: EQ }
        ]
      }
      orderBy: { name: "datePublished", direction: $sortOrder }
      first: $first
      after: $endCursor
    ) {
      total
      pageInfo {
        endCursor
        hasNext
      }
      results {
        id
        ...TagsDetailsFragment
      }
    }
  }
  ${TagsDetailsFragment}
`;
export const GetLatestArticles = gql`
  query GetLatestArticles(
    $language: String!
    $templateId: String!
    $homePath: String!
    $limit: Int!
  ) {
    search(
      where: {
        AND: [
          { name: "_templates", value: $templateId, operator: CONTAINS }
          { name: "_path", value: $homePath, operator: CONTAINS }
          { name: "_language", value: $language, operator: EQ }
        ]
      }
      first: $limit
      orderBy: { name: "datePublished", direction: DESC }
    ) {
      results {
        ...ArticleCardFieldsFragment
      }
    }
  }
  ${ArticleCardFieldsFragment}
`;
export const GetLatestInsights = gql`
  query GetLatestInsights(
    $language: String!
    $templateId: String!
    $homePath: String!
    $limit: Int!
  ) {
    search(
      where: {
        AND: [
          { name: "_templates", value: $templateId, operator: CONTAINS }
          { name: "_path", value: $homePath, operator: CONTAINS }
          { name: "_language", value: $language, operator: EQ }
        ]
      }
      first: $limit
      orderBy: { name: "datePublished", direction: DESC }
    ) {
      results {
        ...InsightCardFieldsFragment
      }
    }
  }
  ${InsightCardFieldsFragment}
`;
export const GetLatestNews = gql`
  query GetLatestNews($language: String!, $templateId: String!, $homePath: String!, $limit: Int!) {
    search(
      where: {
        AND: [
          { name: "_templates", value: $templateId, operator: CONTAINS }
          { name: "_path", value: $homePath, operator: CONTAINS }
          { name: "_language", value: $language, operator: EQ }
        ]
      }
      first: $limit
      orderBy: { name: "datePublished", direction: DESC }
    ) {
      results {
        ...NewsCardFieldsFragment
      }
    }
  }
  ${NewsCardFieldsFragment}
`;
export const GetEventListingQuery = gql`
  query GetEventListingQuery(
    $pageId: String!
    $language: String!
    $templateId: String!
    $endCursor: String
    $first: Int = 10
    $sortOrder: OrderByDirection = ASC
  ) {
    search(
      where: {
        AND: [
          { name: "_templates", value: $templateId, operator: CONTAINS }
          { name: "_path", value: $pageId, operator: CONTAINS }
          { name: "_language", value: $language, operator: EQ }
        ]
      }
      orderBy: { name: "startDate", direction: $sortOrder }
      first: $first
      after: $endCursor
    ) {
      total
      pageInfo {
        endCursor
        hasNext
      }
      results {
        id
        ...TagsDetailsFragment
      }
    }
  }
  ${TagsDetailsFragment}
`;
export const GetFooterColumnLinks = gql`
  query GetFooterColumnLinks($datasourcePath: String!, $language: String!, $templateId: String!) {
    item(path: $datasourcePath, language: $language) {
      links: children(includeTemplateIDs: [$templateId]) {
        results {
          ... on FooterLink {
            link {
              ...LinkFieldFragment
            }
          }
        }
      }
    }
  }
  ${LinkFieldFragment}
`;
export const GetFooterLegalSocialLinks = gql`
  query GetFooterLegalSocialLinks(
    $datasourcePath: String!
    $language: String!
    $templateId: String!
  ) {
    item(path: $datasourcePath, language: $language) {
      socialLinks: children(includeTemplateIDs: [$templateId]) {
        results {
          ... on FooterSocialLink {
            name
            socialIcon {
              value
            }
            link {
              ...LinkFieldFragment
            }
          }
        }
      }
    }
  }
  ${LinkFieldFragment}
`;
export const GetContentTreeNavigation = gql`
  query GetContentTreeNavigation($pageID: String!, $language: String!, $templateId: String!) {
    item(path: $pageID, language: $language) {
      ...PageFieldsFragment
      children(includeTemplateIDs: [$templateId]) {
        total
        results {
          ...PageFieldsFragment
        }
      }
      parent {
        ...PageFieldsFragment
        children(includeTemplateIDs: [$templateId]) {
          total
          results {
            ...PageFieldsFragment
          }
        }
      }
    }
  }
  ${PageFieldsFragment}
`;
export const GetHeaderNavigation = gql`
  query GetHeaderNavigation(
    $datasourcePath: String!
    $linkTemplateId: String!
    $childTemplateId: String!
    $linkGroupTemplateId: String!
    $language: String = "en"
  ) {
    item(path: $datasourcePath, language: $language) {
      id
      name
      links: children(includeTemplateIDs: [$childTemplateId]) {
        results {
          displayName
          ... on HeaderChild {
            ...LinkListFieldFragment
            link {
              jsonValue
            }
            linkGroup: children(includeTemplateIDs: [$linkGroupTemplateId]) {
              results {
                displayName
                ... on HeaderLinkGroup {
                  ...LinkListFieldFragment
                  link {
                    jsonValue
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${LinkListFieldFragment}
`;
export const GetSideNavigation = gql`
  query GetSideNavigation(
    $datasourcePath: String!
    $language: String!
    $sideNavGroupTemplateId: String!
    $sideNavLinkTemplateId: String!
  ) {
    item(path: $datasourcePath, language: $language) {
      children(includeTemplateIDs: [$sideNavGroupTemplateId]) {
        results {
          ... on SideNavGroups {
            heading {
              value
            }
            children(includeTemplateIDs: [$sideNavLinkTemplateId]) {
              results {
                ... on SideNavLinks {
                  link {
                    ...LinkFieldFragment
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${LinkFieldFragment}
`;
export const GetTertiaryNavigation = gql`
  query GetTertiaryNavigation($datasourcePath: String!, $language: String!, $templateId: String!) {
    item(path: $datasourcePath, language: $language) {
      links: children(includeTemplateIDs: [$templateId]) {
        results {
          ... on HeaderChild {
            link {
              ...LinkFieldFragment
            }
          }
        }
      }
    }
  }
  ${LinkFieldFragment}
`;
export const SimplePageListing = gql`
  query SimplePageListing(
    $pageID: String!
    $language: String!
    $endCursor: String
    $first: Int = 5
    $templateId: String!
  ) {
    item(path: $pageID, language: $language) {
      pages: children(includeTemplateIDs: [$templateId], first: $first, after: $endCursor) {
        total
        pageInfo {
          endCursor
          hasNext
        }
        results {
          name
          url {
            path
          }
          ... on CommonBasePage {
            ...ImageFieldFragment
            ...HeadingFieldFragment
            ...SubheadingFieldFragment
          }
        }
      }
    }
  }
  ${ImageFieldFragment}
  ${HeadingFieldFragment}
  ${SubheadingFieldFragment}
`;
export const SimplePageListingWithTags = gql`
  query SimplePageListingWithTags(
    $pageID: String!
    $language: String!
    $endCursor: String
    $first: Int = 5
    $templateId: String!
  ) {
    item(path: $pageID, language: $language) {
      pages: children(includeTemplateIDs: [$templateId], first: $first, after: $endCursor) {
        total
        pageInfo {
          endCursor
          hasNext
        }
        results {
          id
          name
          displayName
          url {
            path
          }
          ...TagsDetailsFragment
        }
      }
    }
  }
  ${TagsDetailsFragment}
`;
export const GetProductDocuments = gql`
  query GetProductDocuments($locationFolderPath: String!, $language: String!) {
    item(path: $locationFolderPath, language: $language) {
      folder_documents: children {
        results {
          name
          file_fields: children {
            results {
              url {
                url
              }
              fields {
                value
              }
            }
          }
        }
      }
    }
  }
`;
export const GetBusinessProfiles = gql`
  query GetBusinessProfiles(
    $pageID: String!
    $language: String!
    $endCursor: String
    $first: Int = 5
    $templateId: String!
  ) {
    search(
      where: {
        AND: [
          { name: "_templates", value: $templateId, operator: CONTAINS }
          { name: "_path", value: $pageID, operator: CONTAINS }
          { name: "_language", value: $language, operator: EQ }
        ]
      }
      first: $first
      after: $endCursor
    ) {
      total
      pageInfo {
        endCursor
        hasNext
      }
      results {
        id
        ...BusinessProfileFragment
      }
    }
  }
  ${BusinessProfileFragment}
`;
export const GetAlertBanner = gql`
  query GetAlertBanner(
    $datasource: String!
    $language: String!
    $fieldName: String = "siteWideAlertBanner"
  ) {
    item(path: $datasource, language: $language) {
      ... on AlertBannerFolder {
        alertBanner: field(name: $fieldName) {
          ... on LookupField {
            targetItem {
              id
              ... on AlertBanner {
                ...HeadingFieldFragment
                ...BodyFieldFragment
                alertCategory {
                  value
                }
              }
            }
          }
        }
      }
    }
  }
  ${HeadingFieldFragment}
  ${BodyFieldFragment}
`;
export const GetItemById = gql`
  query GetItemById($itemId: String!, $language: String!) {
    item(path: $itemId, language: $language) {
      id
      name
      displayName
    }
  }
`;
export const GetEventById = gql`
  query GetEventById($itemId: String!, $language: String!) {
    item(path: $itemId, language: $language) {
      id
      name
      displayName
      ...EventCardFieldsFragment
    }
  }
  ${EventCardFieldsFragment}
`;
export const GetSimplePageById = gql`
  query GetSimplePageById($itemId: String!, $language: String!) {
    item(path: $itemId, language: $language) {
      id
      name
      displayName
      ...SimplePageListingFragment
    }
  }
  ${SimplePageListingFragment}
`;
export const GetRecipePageById = gql`
  query GetRecipePageById($itemId: String!, $language: String!) {
    item(path: $itemId, language: $language) {
      id
      name
      displayName
      ...RecipeCardFieldsFragment
    }
  }
  ${RecipeCardFieldsFragment}
`;
export const GetArticleById = gql`
  query GetArticleById($itemId: String!, $language: String!) {
    item(path: $itemId, language: $language) {
      id
      name
      displayName
      ...ArticleCardFieldsFragment
    }
  }
  ${ArticleCardFieldsFragment}
`;
export const GetInsightById = gql`
  query GetInsightById($itemId: String!, $language: String!) {
    item(path: $itemId, language: $language) {
      id
      name
      displayName
      ...InsightCardFieldsFragment
    }
  }
  ${InsightCardFieldsFragment}
`;
export const GetNewsById = gql`
  query GetNewsById($itemId: String!, $language: String!) {
    item(path: $itemId, language: $language) {
      id
      name
      displayName
      ...NewsCardFieldsFragment
    }
  }
  ${NewsCardFieldsFragment}
`;
export const GetItemPath = gql`
  query GetItemPath($itemId: String!, $language: String!) {
    item(path: $itemId, language: $language) {
      url {
        path
      }
    }
  }
`;
export const GetPageAuth = gql`
  query GetPageAuth($path: String!, $siteName: String!, $language: String!) {
    layout(site: $siteName, routePath: $path, language: $language) {
      item {
        field(name: "pageRequiresAuth") {
          name
          value
        }
      }
    }
  }
`;
export const GetPeoplePageDisplayNamePerLanguage = gql`
  query GetPeoplePageDisplayNamePerLanguage($itemId: String!) {
    item(path: $itemId, language: "en") {
      id
      path
      languages {
        language {
          name
        }
        displayName
      }
    }
  }
`;
export const GetPeoplePageDisplayName = gql`
  query GetPeoplePageDisplayName($peoplePageId: String!) {
    item(path: $peoplePageId, language: "en") {
      languages {
        language {
          name
        }
        displayName
      }
    }
  }
`;
export const GetSiteItemData = gql`
  query GetSiteItemData($siteName: String!) {
    layout(site: $siteName, routePath: "/", language: "en") {
      item {
        contentRoot: parent {
          id
          path
        }
      }
    }
  }
`;
export const GetAllProfiles = gql`
  query GetAllProfiles($templateId: String!, $siteId: String!, $first: Int!, $after: String) {
    search(
      where: {
        AND: [
          { name: "_templates", value: $templateId, operator: EQ }
          { name: "_path", value: $siteId, operator: CONTAINS }
        ]
      }
      first: $first
      after: $after
    ) {
      pageInfo {
        hasNext
        endCursor
      }
      results {
        displayName
        updatedDateTime: field(name: "__Updated") {
          value
        }
        language {
          name
        }
        sitemapPriority: field(name: "priority") {
          jsonValue
        }
        sitemapChangeFreq: field(name: "ChangeFrequency") {
          jsonValue
        }
      }
    }
  }
`;
export const GetPersonas = gql`
  query GetPersonas($sitePath: String!, $language: String!) {
    item(path: $sitePath, language: $language) {
      id
      children {
        results {
          ... on PersonaIdentity {
            id
            contentName {
              value
            }
            description {
              value
            }
          }
        }
      }
    }
  }
`;
export const GetProfileBySlug = gql`
  query GetProfileBySlug($language: String!, $templateId: String!, $name: String!, $path: String!) {
    search(
      where: {
        AND: [
          { name: "_language", value: $language, operator: EQ }
          { name: "_templates", value: $templateId, operator: EQ }
          { name: "_path", value: $path, operator: EQ }
          { name: "_name", value: $name, operator: EQ }
        ]
      }
      first: 10
    ) {
      pageInfo {
        hasNext
        endCursor
      }
      results {
        name
        displayName
        ... on PeopleProfile {
          id
          description {
            value
          }
          email {
            value
          }
          phone {
            value
          }
          role {
            value
          }
          company {
            value
          }
          image {
            src
            alt
            jsonValue
          }
          imageMobile {
            jsonValue
          }
          expertise {
            jsonValue
          }
          company {
            value
          }
          firstName {
            value
          }
          lastName {
            value
          }
          location {
            jsonValue
          }
        }
      }
    }
  }
`;
export const GetProfileBySlugAdditional = gql`
  query GetProfileBySlugAdditional(
    $language: String!
    $templateId: String!
    $name: String!
    $path: String!
  ) {
    search(
      where: {
        AND: [
          { name: "_language", value: $language, operator: EQ }
          { name: "_templates", value: $templateId, operator: EQ }
          { name: "_path", value: $path, operator: EQ }
          { name: "_name", value: $name, operator: EQ }
        ]
      }
      first: 1
    ) {
      pageInfo {
        hasNext
        endCursor
      }
      results {
        ... on PeopleProfile {
          website {
            jsonValue
          }
          linkedInLink {
            jsonValue
          }
          children {
            results {
              name
              ... on Item {
                children {
                  results {
                    name
                    displayName
                    ... on Achievement {
                      description {
                        value
                      }
                    }
                    ... on Education {
                      description {
                        value
                      }
                    }
                    ... on Involvement {
                      heading {
                        value
                      }
                      description {
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
export const GetSiteInfoPath = gql`
  query GetSiteInfoPath($siteName: String!) {
    site {
      siteInfo(site: $siteName) {
        rootPath
      }
    }
  }
`;
export const GetSiteRootInfo = gql`
  query GetSiteRootInfo($siteName: String!, $language: String!) {
    layout(site: $siteName, routePath: "/", language: $language) {
      item {
        homeItemPath: path
        contentRoot: parent {
          id
          path
        }
      }
    }
  }
`;
export const GetPeoplePageId = gql`
  query GetPeoplePageId($siteSettingsPath: String!) {
    item(path: $siteSettingsPath, language: "en") {
      peoplePage: field(name: "peoplePage") {
        ... on LinkField {
          targetItem {
            id
          }
        }
      }
    }
  }
`;
export const GetAuthConfig = gql`
  query GetAuthConfig($siteSettingsPath: String!) {
    item(path: $siteSettingsPath, language: "en") {
      accountPageLink: field(name: "accountPageLink") {
        ... on LinkField {
          targetItem {
            id
            url {
              path
            }
          }
        }
      }
      signOutPageLink: field(name: "signOutPageLink") {
        ... on LinkField {
          targetItem {
            id
            url {
              path
            }
          }
        }
      }
    }
  }
`;
export const GetUrlByItemId = gql`
  query GetUrlByItemId($itemId: String!, $language: String!) {
    item(path: $itemId, language: $language) {
      url {
        path
      }
    }
  }
`;
export const GetKnowledgeCenterResources = gql`
  query GetKnowledgeCenterResources(
    $sitePath: String!
    $language: String!
    $first: Int!
    $after: String
  ) {
    item(path: $sitePath, language: $language) {
      id
      name
      displayName
      children(first: $first, after: $after) {
        pageInfo {
          endCursor
          hasNext
        }
        results {
          ... on KnowledgeCenterResource {
            ...KnowledgeCenterResourceFragment
          }
        }
      }
    }
  }
  ${KnowledgeCenterResourceFragment}
`;
