import { Fragment } from 'react';
import Link from 'next/link';
import { CaretIcon } from './Breadcrumbs';

export const SubRoutes: React.FC<SubRoutesType> = ({ subRoute, pageTitle }) => {
  return (
    <>
      {subRoute.map((breadcrumb, idx) => {
        return (
          <Fragment key={`breadcrumb-link--${idx}`}>
            <Link
              href={breadcrumb.path.toLowerCase()}
              className="hidden items-center justify-center text-tertiary transition hover:underline md:flex"
              aria-label={breadcrumb.name}
              passHref
            >
              {breadcrumb.name}
            </Link>
            <CaretIcon />
          </Fragment>
        );
      })}
      <span className="disabled hidden md:block">{pageTitle}</span>
    </>
  );
};

type SubRoutesType = {
  subRoute: {
    name: string;
    path: string;
  }[];
  pageTitle: string;
};

export default SubRoutes;
