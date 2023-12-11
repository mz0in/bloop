import { ReactNode } from 'react';

const IconWrapper =
  (icon: ReactNode) =>
  //eslint-disable-next-line
  ({ sizeClassName, className }: { raw?: boolean; sizeClassName?: string; className?: string }) =>
    (
    <span
      className={`${
        sizeClassName || 'w-5 h-5'
      } inline-block flex-shrink-0 flex-grow-0 ${className || ''}`}
    >
      {icon}
    </span>
  );

export default IconWrapper;
