import type { ActionProp, ItemClickedAction } from '@sitecore-search/core';
import { useRouter } from 'next/router';
import { KnowledgeCenterHorizontalCardStyled } from './styled';
import {
  getFileIcon,
  hasFileIcon,
  formatFileSize,
  getFileTypeDisplay,
  getHighlightedText,
  normalizeTitleText,
  formatDate,
  cn,
} from 'lib/helpers';
import { IconFas } from 'component-children/Shared/Icon/Icon';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { KnowledgeCenterModel } from '../../KnowledgeCenterSearch/types';
import SearchResultLink from 'src/widgets/SearchResults/components/SearchResultLink';
import { useFrame } from 'lib/hooks/useFrame';
import { mainLanguage } from 'lib/i18n/i18n-config';
import { SECONDARY_THEME } from 'lib/const';

type KnowledgeCenterHorizontalCardProps = {
  resource: KnowledgeCenterModel;
  onItemClick: ActionProp<ItemClickedAction>;
  index: number;
};

const KnowledgeCenterHorizontalCard = ({
  resource,
  onItemClick,
  index,
}: KnowledgeCenterHorizontalCardProps) => {
  const router = useRouter();
  const { effectiveTheme } = useFrame();
  const textTheme = effectiveTheme === SECONDARY_THEME ? 'text-tertiary' : 'text-secondary';

  const fileIcon = getFileIcon(resource.m_file_extension || '');
  const fileSize = resource.m_file_size ? formatFileSize(resource.m_file_size) : '';
  const fileType = getFileTypeDisplay(resource.m_file_extension || '');
  const type = (resource.m_content_type as string) || 'Knowledge Center Resource';
  const title = normalizeTitleText(resource.name || 'Untitled');
  const formattedDate = formatDate(resource.m_lastupdated as string, router.locale || mainLanguage);

  const ariaLabel = ['Download document', title && `: ${title}`].filter(Boolean).join('');

  return (
    <KnowledgeCenterHorizontalCardStyled.Root
      className="group border border-content/20"
      data-component="KnowledgeCenterHorizontalCard"
    >
      <SearchResultLink
        result={resource}
        onItemClick={onItemClick}
        index={index}
        openInNewWindow={true}
        ariaLabel={ariaLabel}
        className="flex h-full w-full flex-col md:flex-row"
      >
        <KnowledgeCenterHorizontalCardStyled.IconWrapper>
          {hasFileIcon(resource.m_file_extension || '') ? (
            <IconFas icon={fileIcon as IconName} className="h-10 w-10" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center text-sm font-bold">
              {(resource.m_file_extension || 'FILE').toUpperCase()}
            </div>
          )}
        </KnowledgeCenterHorizontalCardStyled.IconWrapper>
        <KnowledgeCenterHorizontalCardStyled.Content className="w-full">
          <div className="copy-xs mb-2 flex w-full min-w-0 flex-1 flex-row items-start gap-6">
            <div className="flex min-w-0 flex-row gap-2 overflow-hidden">
              {type && (
                <span
                  className={cn(
                    'truncate break-words uppercase leading-none tracking-wide',
                    textTheme
                  )}
                >
                  {type}
                </span>
              )}
              {formattedDate && (
                <time
                  className={cn(
                    'flex-shrink-0 whitespace-nowrap uppercase leading-none',
                    textTheme,
                    type && 'border-l border-content pl-2',
                    'md:text-right'
                  )}
                  dateTime={resource.m_lastupdated as string}
                >
                  {formattedDate}
                </time>
              )}
            </div>
          </div>
          <p className="heading-lg mb-2 group-hover:underline">{title}</p>
          {resource.description && (
            <KnowledgeCenterHorizontalCardStyled.Description className="mb-2">
              <span
                dangerouslySetInnerHTML={{
                  __html: getHighlightedText(resource.highlight?.description, resource.description),
                }}
              />
            </KnowledgeCenterHorizontalCardStyled.Description>
          )}
          <div
            className={cn(
              'copy-xs flex flex-1 flex-row gap-2 border-t border-content pt-3 leading-none',
              textTheme
            )}
          >
            <span>{fileType}</span>
            <span className={cn(fileType && 'border-l border-content pl-2')}>{fileSize}</span>
          </div>
        </KnowledgeCenterHorizontalCardStyled.Content>
      </SearchResultLink>
    </KnowledgeCenterHorizontalCardStyled.Root>
  );
};

export default KnowledgeCenterHorizontalCard;
export type { KnowledgeCenterModel, KnowledgeCenterHorizontalCardProps };
