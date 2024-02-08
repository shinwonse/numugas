import { HamburgerMenuIcon, HomeIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '#/utils/cn';

import Logo from '../../../../public/logo.png';

function Header() {
  return (
    <header
      className={cn(
        'flex flex-row justify-between py-4 bg-accent rounded-b-2xl px-4'
      )}
    >
      <button type="button">
        <HamburgerMenuIcon color="white" height={24} width={24} />
      </button>
      <Link
        className={cn(
          'left-1/2 transform -translate-x-1/2 h-20 w-20 absolute top-0.5 md:w-28 md:h-28'
        )}
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
