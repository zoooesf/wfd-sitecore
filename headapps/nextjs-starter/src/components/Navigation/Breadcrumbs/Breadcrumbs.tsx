import { Field, GetComponentServerProps, Item, RouteData } from '@sitecore-content-sdk/nextjs';
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { ComponentProps } from 'lib/component-props';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { getPagePathList } from 'component-children/Navigation/Breadcrumbs/Breadcrumbs';
import Frame from 'component-children/Shared/Frame/Frame';
import BreadcrumbsRendering from 'component-children/Navigation/Breadcrumbs/Breadcrumbs';
import { cn } from 'lib/helpers/classname';
import { useFrame } from 'lib/hooks/useFrame';

export const Default: React.FC<BreadcrumbsProps> = (props: BreadcrumbsProps) => {
  const { route, pathList } = props;
  const router = useRouter();
  const { effectiveTheme } = useFrame();

  // Memoize path calculation to avoid recalculation on every render
  const path = useMemo(
    () => router.asPath.substring(1).split('/').filter(Boolean),
    [router.asPath]
  );

  const [subRoute, setSubRoute] = useState<BreadcrumbPathType[]>([]);
  const [pageTitle, setPageTitle] = useState<string>('');

  const parseNameList = useCallback((nameList: ParentType): string[] => {
    if (!nameList) return [];

    const names: string[] = [];
    let current: ParentType = nameList;

    while (current) {
      names.push(current.displayName ?? current.name ?? '');
      current = current.parent as ParentType;
    }

    return names.reverse();
  }, []);

  useEffect(() => {
    // Wrap state updates in startTransition
    startTransition(() => {
      // Get the list of display names from the path hierarchy
      const nameList = parseNameList(pathList);
      const breadcrumbList: BreadcrumbPathType[] = [];
      const heading = route?.fields?.heading as Field<string>;

      if (path.length > 0) {
        let currentPath = '';
        path.slice(0, -1).forEach((segment, index) => {
          currentPath = `${currentPath}/${segment}`;
          if (nameList[index]) {
            breadcrumbList.push({
              name: nameList[index],
              path: currentPath,
            });
          }
        });

        setSubRoute(breadcrumbList);
      }

      setPageTitle(heading?.value ?? '');
    });
  }, [route, pathList, path, parseNameList]);

  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <div className={cn('w-full bg-surface text-content', effectiveTheme)}>
        <ContainedWrapper className="min-h-10">
          <BreadcrumbsRendering path={path} subRoute={subRoute} pageTitle={pageTitle} />
        </ContainedWrapper>
      </div>
    </Frame>
  );
};

export const getComponentServerProps: GetComponentServerProps = async (_, layoutData) => {
  const data = await getPagePathList(layoutData);

  return {
    pathList: data?.parent ?? null, // Used for Breadcrumb Path
    route: layoutData?.sitecore?.route, // Used for Current Page Title
  };
};

export type BreadcrumbPathType = {
  name: string;
  path: string;
};

type ParentType = {
  name: string;
  displayName: string;
  parent?: ParentType;
} | null;

type BreadcrumbsProps = ComponentProps & {
  route: RouteData<Record<string, Field | Item | Item[]>> | null;
  pathList: ParentType;
};
