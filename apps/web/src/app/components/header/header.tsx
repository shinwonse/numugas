import Image from 'next/image';
import Link from 'next/link';

import { cn } from '#/utils/cn';

import Logo from '../../../../public/logo.png';

function Header() {
  return (
    <header
      className={cn(
        'flex flex-row items-center justify-center py-6 bg-accent rounded-b-2xl md:py-8'
      )}
    >
      <Link
        className={cn('h-20 w-20 absolute top-0.5 md:w-28 md:h-28')}
        href="/"
      >
        <Image alt="담장 로고" fill src={Logo} />
      </Link>
    </header>
  );
}

export default Header;
