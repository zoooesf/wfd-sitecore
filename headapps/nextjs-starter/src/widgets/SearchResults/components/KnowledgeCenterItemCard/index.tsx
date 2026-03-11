import type { ActionProp, ItemClickedAction } from '@sitecore-search/core';
import { useRouter } from 'next/router';
import { KnowledgeCenterItemCardStyled } from './styled';
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

type KnowledgeCenterItemCardProps = {
  resource: KnowledgeCenterModel;
  onItemClick: ActionProp<ItemClickedAction>;
  index: number;
};

const KnowledgeCenterItemCard = ({
  resource,
  onItemClick,
  index,
}: KnowledgeCenterItemCardProps) => {
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
    <KnowledgeCenterItemCardStyled.Root className="group" data-component="KnowledgeCenterItemCard">
      <KnowledgeCenterItemCardStyled.IconWrapper>
        <SearchResultLink
          result={resource}
          onItemClick={onItemClick}
          index={index}
          openInNewWindow={true}
          ariaLabel={ariaLabel}
          className="flex items-start gap-4 p-4 transition-colors hover:bg-surface/5"
        >
          {hasFileIcon(resource.m_file_extension || '') ? (
            <IconFas icon={fileIcon as IconName} className="h-10 w-10" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center text-sm font-bold text-primary">
              {(resource.m_file_extension || 'FILE').toUpperCase()}
            </div>
          )}
        </SearchResultLink>
      </KnowledgeCenterItemCardStyled.IconWrapper>
      <KnowledgeCenterItemCardStyled.Content className="flex flex-1 flex-col">
        <div className="copy-xs mb-2 flex min-w-0 flex-row items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-row gap-2 overflow-hidden">
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
          </div>
          {formattedDate && (
            <time
              className={cn(
                'flex-shrink-0 whitespace-nowrap uppercase leading-none',
                textTheme,
                'md:text-right'
              )}
              dateTime={resource.m_lastupdated as string}
            >
              {formattedDate}
            </time>
          )}
        </div>
        <SearchResultLink
          result={resource}
          onItemClick={onItemClick}
          index={index}
          openInNewWindow={true}
          ariaLabel={ariaLabel}
        >
          <KnowledgeCenterItemCardStyled.Title className="heading-lg mb-2 group-hover:underline">
            {title}
          </KnowledgeCenterItemCardStyled.Title>
        </SearchResultLink>
        {resource.description && (
          <KnowledgeCenterItemCardStyled.Description className="mb-2">
            <span
              dangerouslySetInnerHTML={{
                __html: getHighlightedText(resource.highlight?.description, resource.description),
              }}
            />
          </KnowledgeCenterItemCardStyled.Description>
        )}
        <div
          className={cn(
            'copy-xs mt-auto flex flex-row gap-2 border-t border-content pt-3 leading-none',
            textTheme
          )}
        >
          <span>{fileType}</span>
          <span className={cn(fileType && 'border-l border-content pl-2')}>{fileSize}</span>
        </div>
      </KnowledgeCenterItemCardStyled.Content>
    </KnowledgeCenterItemCardStyled.Root>
  );
};

export default KnowledgeCenterItemCard;
export type { KnowledgeCenterModel, KnowledgeCenterItemCardProps };
