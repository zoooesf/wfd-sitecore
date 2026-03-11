import Frame from 'component-children/Shared/Frame/Frame';
import {
  ProductDocumentsFields,
  ProductDocumentsProps,
  PDFFileType,
} from 'lib/types/components/Products/product-documents';
import { GetComponentServerProps, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { ProductDocuments } from 'component-children/Product/ProductDocuments/ProductDocuments';
import { getGraphQlClient } from 'lib/graphql-client';
import { GetProductDocuments } from 'graphql/generated/graphql-documents';
import { getLayoutLanguage } from 'lib/helpers';

const ProductDocumentsDefault: React.FC<ProductDocumentsProps> = (props) => {
  const { page } = useSitecore();
  const routeFields = page?.layout?.sitecore?.route?.fields as ProductDocumentsFields;

  const selectedData = routeFields?.productDocumetation;
  const mediaQueryData = props.fields;

  // Filter pdfData from mediaQueryData where name matches selectedData names
  const filteredData = mediaQueryData?.fields?.filter((item: PDFFileType) =>
    selectedData?.some((selected) => selected.name === item.name)
  );

  return (
    <Frame params={props.params}>
      <ContainedWrapper>
        <ProductDocuments {...props} fields={filteredData} />
      </ContainedWrapper>
    </Frame>
  );
};

type ProductDocumentsGraphQLResponse = {
  item: {
    folder_documents: {
      results: {
        name: string;
        file_fields?: {
          results: {
            url: {
              url: string;
            };
            fields: {
              value?: string;
            }[];
          }[];
        };
      }[];
    };
  };
};

export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  const graphQLClient = getGraphQlClient();
  const locationFolderPath = '730C1699-87A4-4CA7-A9CE-294AD7151F13';
  const language = getLayoutLanguage(layoutData);

  try {
    const data = await graphQLClient.request<ProductDocumentsGraphQLResponse>(
      GetProductDocuments.loc?.source.body || '',
      {
        locationFolderPath,
        language,
      }
    );

    // If no documents are found, return an empty array
    if (!data?.item?.folder_documents?.results) {
      console.warn('Item not found or has no documents at path:', locationFolderPath);
      return {
        rendering,
        fields: {
          ...rendering.fields,
          pdfData: [] as PDFFileType[],
        },
      };
    }

    const pdfData = data.item.folder_documents.results.map((folder) => ({
      name: folder.name ?? '',
      fields: (folder.file_fields?.results ?? []).map((file) => ({
        url: file.url?.url ?? '',
        extension: file.fields?.[1]?.value ?? '',
        title: file.fields?.[5]?.value ?? '',
        size: file.fields?.[4]?.value ?? '',
      })),
    }));

    return {
      rendering,
      fields: {
        ...rendering.fields,
        fields: pdfData,
      },
    };
  } catch (error) {
    console.error('Error fetching Product Documents:', error);
    return {
      rendering,
      fields: {
        ...rendering.fields,
        fields: [] as PDFFileType[],
      },
    };
  }
};

export const Default = ProductDocumentsDefault;
