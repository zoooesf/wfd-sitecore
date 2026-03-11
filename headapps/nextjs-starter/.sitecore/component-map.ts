// Below are built-in components that are available in the app, it's recommended to keep them as is

import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in components
import * as WhereToBuy from 'src/components/WhereToBuy/WhereToBuy';
import * as TabsContainer from 'src/components/Tabs/TabsContainer/TabsContainer';
import * as TabItem from 'src/components/Tabs/TabItem/TabItem';
import * as SimplePageListingWithFilters from 'src/components/Search/SimplePageListingWithFilters';
import * as SearchResults from 'src/components/Search/SearchResults';
import * as ProductSearch from 'src/components/Search/ProductSearch';
import * as PeopleSearch from 'src/components/Search/PeopleSearch';
import * as NoWidgetIdError from 'src/components/Search/NoWidgetIdError';
import * as NewsListingWithFilters from 'src/components/Search/NewsListingWithFilters';
import * as KnowledgeCenterSearch from 'src/components/Search/KnowledgeCenterSearch';
import * as InsightsListingWithFilters from 'src/components/Search/InsightsListingWithFilters';
import * as EventListingWithFilters from 'src/components/Search/EventListingWithFilters';
import * as ArticleListingWithFilters from 'src/components/Search/ArticleListingWithFilters';
import * as ProductTechSpecs from 'src/components/Products/ProductTechSpecs/ProductTechSpecs';
import * as ProductResources from 'src/components/Products/ProductResources/ProductResources';
import * as ProductOverview from 'src/components/Products/ProductOverview/ProductOverview';
import * as ProductOrderingInfo from 'src/components/Products/ProductOrderingInfo/ProductOrderingInfo';
import * as ProductHeader from 'src/components/Products/ProductHeader/ProductHeader';
import * as ProductDocuments from 'src/components/Products/ProductDocuments/ProductDocuments';
import * as PersonProfile from 'src/components/People/PersonProfile/PersonProfile';
import * as PartialDesignDynamicPlaceholder from 'src/components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder';
import * as SimplePageListing from 'src/components/Page Content/SimplePageListing/SimplePageListing';
import * as Separator from 'src/components/Page Content/Separator/Separator';
import * as RecipePageListing from 'src/components/Page Content/RecipePageListing/RecipePageListing';
import * as Image from 'src/components/Page Content/Image/Image';
import * as CTACard from 'src/components/Page Content/CTACard/CTACard';
import * as CTABlock from 'src/components/Page Content/CTABlock/CTABlock';
import * as ContentBlock from 'src/components/Page Content/ContentBlock/ContentBlock';
import * as CommonRichtext from 'src/components/Page Content/CommonRichtext/CommonRichtext';
import * as Callout from 'src/components/Page Content/Callout/Callout';
import * as Button from 'src/components/Page Content/Button/Button';
import * as AwakeButton from 'src/components/Page Content/AwakeButton/AwakeButton';
import * as AlertBanner from 'src/components/Page Content/AlertBanner/AlertBanner';
import * as TertiaryNav from 'src/components/Navigation/TertiaryNav/TertiaryNav';
import * as SideNav from 'src/components/Navigation/SideNav/SideNav';
import * as PersonaSwitcher from 'src/components/Navigation/PersonaSwitcher/PersonaSwitcher';
import * as Login from 'src/components/Navigation/Login/Login';
import * as LanguageSwitcher from 'src/components/Navigation/LanguageSwitcher/LanguageSwitcher';
import * as Header from 'src/components/Navigation/Header/Header';
import * as ContentTreeSideNav from 'src/components/Navigation/ContentTreeSideNav/ContentTreeSideNav';
import * as Breadcrumbs from 'src/components/Navigation/Breadcrumbs/Breadcrumbs';
import * as IconFeatureCardGrid from 'src/components/IconFeatureCards/IconFeatureCardGrid/IconFeatureCardGrid';
import * as IconFeatureCard from 'src/components/IconFeatureCards/IconFeatureCard/IconFeatureCard';
import * as FooterMenu from 'src/components/Footer/FooterMenu/FooterMenu';
import * as FooterMain from 'src/components/Footer/FooterMain/FooterMain';
import * as FooterLegal from 'src/components/Footer/FooterLegal/FooterLegal';
import * as FooterCol from 'src/components/Footer/FooterCol/FooterCol';
import * as EventListing from 'src/components/Events/EventListing/EventListing';
import * as EventDetails from 'src/components/Events/EventDetails/EventDetails';
import * as EventCard from 'src/components/Events/EventCard/EventCard';
import * as RowSplitter from 'src/components/Containers/RowSplitter/RowSplitter';
import * as FullWidth from 'src/components/Containers/FullWidth/FullWidth';
import * as ColumnSplitter from 'src/components/Containers/ColumnSplitter/ColumnSplitter';
import * as RecipePreviewCard from 'src/components/Cards/RecipePreviewCard/RecipePreviewCard';
import * as RecipeCard from 'src/components/Cards/RecipeCard/RecipeCard';
import * as CardGrid from 'src/components/Cards/CardGrid/CardGrid';
import * as CardCarousel from 'src/components/Cards/CardCarousel/CardCarousel';
import * as CardBanner from 'src/components/Cards/CardBanner/CardBanner';
import * as Card from 'src/components/Cards/Card/Card';
import * as VideoBanner from 'src/components/Banners/VideoBanner/VideoBanner';
import * as TextBanner from 'src/components/Banners/TextBanner/TextBanner';
import * as SplitBanner from 'src/components/Banners/SplitBanner/SplitBanner';
import * as HeroBanner from 'src/components/Banners/HeroBanner/HeroBanner';
import * as ContentBanner from 'src/components/Banners/ContentBanner/ContentBanner';
import * as LatestArticleGrid from 'src/components/Articles/LatestArticleGrid/LatestArticleGrid';
import * as ArticleListing from 'src/components/Articles/ArticleListing/ArticleListing';
import * as ArticleHeader from 'src/components/Articles/ArticleHeader/ArticleHeader';
import * as ArticleFooter from 'src/components/Articles/ArticleFooter/ArticleFooter';
import * as ArticleBody from 'src/components/Articles/ArticleBody/ArticleBody';
import * as ArticleBanner from 'src/components/Articles/ArticleBanner/ArticleBanner';
import * as AccountInformation from 'src/components/Account/AccountInformation/AccountInformation';
import * as AccordionDrawer from 'src/components/Accordions/AccordionDrawer/AccordionDrawer';
import * as Accordion from 'src/components/Accordions/Accordion/Accordion';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],
  ['WhereToBuy', { ...WhereToBuy }],
  ['TabsContainer', { ...TabsContainer }],
  ['TabItem', { ...TabItem }],
  ['SimplePageListingWithFilters', { ...SimplePageListingWithFilters }],
  ['SearchResults', { ...SearchResults }],
  ['ProductSearch', { ...ProductSearch }],
  ['PeopleSearch', { ...PeopleSearch }],
  ['NoWidgetIdError', { ...NoWidgetIdError }],
  ['NewsListingWithFilters', { ...NewsListingWithFilters }],
  ['KnowledgeCenterSearch', { ...KnowledgeCenterSearch }],
  ['InsightsListingWithFilters', { ...InsightsListingWithFilters }],
  ['EventListingWithFilters', { ...EventListingWithFilters }],
  ['ArticleListingWithFilters', { ...ArticleListingWithFilters }],
  ['ProductTechSpecs', { ...ProductTechSpecs }],
  ['ProductResources', { ...ProductResources }],
  ['ProductOverview', { ...ProductOverview }],
  ['ProductOrderingInfo', { ...ProductOrderingInfo }],
  ['ProductHeader', { ...ProductHeader }],
  ['ProductDocuments', { ...ProductDocuments }],
  ['PersonProfile', { ...PersonProfile }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
  ['SimplePageListing', { ...SimplePageListing }],
  ['Separator', { ...Separator }],
  ['RecipePageListing', { ...RecipePageListing }],
  ['Image', { ...Image }],
  ['CTACard', { ...CTACard }],
  ['CTABlock', { ...CTABlock }],
  ['ContentBlock', { ...ContentBlock }],
  ['CommonRichtext', { ...CommonRichtext }],
  ['Callout', { ...Callout }],
  ['Button', { ...Button }],
  ['AwakeButton', { ...AwakeButton }],
  ['AlertBanner', { ...AlertBanner }],
  ['TertiaryNav', { ...TertiaryNav }],
  ['SideNav', { ...SideNav }],
  ['PersonaSwitcher', { ...PersonaSwitcher }],
  ['Login', { ...Login }],
  ['LanguageSwitcher', { ...LanguageSwitcher }],
  ['Header', { ...Header }],
  ['ContentTreeSideNav', { ...ContentTreeSideNav }],
  ['Breadcrumbs', { ...Breadcrumbs }],
  ['IconFeatureCardGrid', { ...IconFeatureCardGrid }],
  ['IconFeatureCard', { ...IconFeatureCard }],
  ['FooterMenu', { ...FooterMenu }],
  ['FooterMain', { ...FooterMain }],
  ['FooterLegal', { ...FooterLegal }],
  ['FooterCol', { ...FooterCol }],
  ['EventListing', { ...EventListing }],
  ['EventDetails', { ...EventDetails }],
  ['EventCard', { ...EventCard }],
  ['RowSplitter', { ...RowSplitter }],
  ['FullWidth', { ...FullWidth }],
  ['ColumnSplitter', { ...ColumnSplitter }],
  ['RecipePreviewCard', { ...RecipePreviewCard }],
  ['RecipeCard', { ...RecipeCard }],
  ['CardGrid', { ...CardGrid }],
  ['CardCarousel', { ...CardCarousel }],
  ['CardBanner', { ...CardBanner }],
  ['Card', { ...Card }],
  ['VideoBanner', { ...VideoBanner }],
  ['TextBanner', { ...TextBanner }],
  ['SplitBanner', { ...SplitBanner }],
  ['HeroBanner', { ...HeroBanner }],
  ['ContentBanner', { ...ContentBanner }],
  ['LatestArticleGrid', { ...LatestArticleGrid }],
  ['ArticleListing', { ...ArticleListing }],
  ['ArticleHeader', { ...ArticleHeader }],
  ['ArticleFooter', { ...ArticleFooter }],
  ['ArticleBody', { ...ArticleBody }],
  ['ArticleBanner', { ...ArticleBanner }],
  ['AccountInformation', { ...AccountInformation }],
  ['AccordionDrawer', { ...AccordionDrawer }],
  ['Accordion', { ...Accordion }],
]);

export default componentMap;
