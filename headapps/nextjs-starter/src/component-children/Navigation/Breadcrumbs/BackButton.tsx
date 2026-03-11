import { useRouter } from 'next/router';
import { BreadcrumbPathType } from 'components/Navigation/Breadcrumbs/Breadcrumbs';
import Icon from 'component-children/Shared/Icon/Icon';
import { useTranslation } from 'lib/hooks/useTranslation';

export const BackButton: React.FC<BackButtonProps> = ({ subRoute }) => {
  const { t } = useTranslation();
  const router = useRouter();
  // Wait for router to be ready
  if (!router.isReady) return null;

  const homePageName = t('Home');
  const previousPageName = subRoute.length > 0 ? subRoute[subRoute.length - 1].name : homePageName;
  const newRoute =
    previousPageName === homePageName
      ? '/'
      : router.asPath.split('/').slice(0, -1).join('/') || '/';

  const handlePreviousPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(newRoute);
  };

  return (
    <a
      className="body-small text-secondary-100 flex items-center justify-center gap-1 transition hover:text-black active:text-primary md:hidden"
      aria-label={`${t('Back to')} ${previousPageName}`}
      href={newRoute}
      onClick={handlePreviousPage}
    >
      <Icon className="block h-3 w-3 md:hidden" color="text-black" prefix="fas" icon="angle-left" />
      <span>{previousPageName}</span>
    </a>
  );
};

type BackButtonProps = {
  subRoute: BreadcrumbPathType[];
};

export default BackButton;
