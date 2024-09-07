import { HamburgerMenuIcon, HomeIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '#/utils/cn';

import Logo from '../../../../public/logo.png';

function Header() {
  return (
    <header className={cn('flex flex-row justify-between rounded-b-2xl bg-accent p-4')}>
      <button type="button">
        <HamburgerMenuIcon color="white" height={24} width={24} />
      </button>
      <Link
        className={cn('absolute left-1/2 top-0.5 size-20 -translate-x-1/2 md:size-28')}
        href="/"
      >
        <Image alt="담장 로고" fill priority src={Logo} />
      </Link>
      <Link href="/">
        <HomeIcon color="white" height={24} width={24} />
      </Link>
    </header>
  );
}

export default Header;
