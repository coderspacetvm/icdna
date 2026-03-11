import React from 'react';
import Link from 'next/link';

type Props = {
  title: string;
  className?: string;
  containerStyle?: React.CSSProperties;
  href?: string;
};

import {svg} from '../svg';

export const BlockHeading: React.FC<Props> = ({
  title,
  className,
  containerStyle,
  href,
}) => {
  return (
    <div
      className={className}
      style={{
        ...containerStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <h4>{title}</h4>
      {href && (
        <Link href={href}>
          <svg.ViewAllSvg />
        </Link>
      )}
    </div>
  );
};
