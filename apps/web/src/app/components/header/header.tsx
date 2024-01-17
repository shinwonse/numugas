import Image from 'next/image';
import Link from 'next/link';

import { cn } from '#/utils/cn';

import LongLogo from '../../../../public/long-logo.png';

function Header() {
  return (
    <header className={cn('flex flex-row items-center justify-center pb-4')}>
      <Link href="/">
        <Image
          alt="담장너머가쓰 긴 로고"
          height={80}
          src={LongLogo}
        />
      </Link>
    </header>
  );
}

export default Header;
