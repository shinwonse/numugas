'use client';

import { cn } from '@numugas/util';
import { motion } from 'framer-motion';
import Image from 'next/image';

import ChampLogo from '../../../../public/champ.jpg';
import Logo from '../../../../public/logo.png';
import NowonLogo from '../../../../public/nowon.png';

const Introduction = () => {
  return (
    <div className={cn('flex flex-col gap-20')}>
      <div className={cn('flex flex-col items-center px-4 md:px-16')}>
        <Image src={Logo} alt="담장NUMUGAS 로고" width={300} height={300} />
      </div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{
          ease: 'easeInOut',
          duration: 2,
          x: { duration: 1 },
        }}
        className={cn('flex flex-col gap-5 md:gap-10')}
      >
        <header className={cn('px-4 md:px-16')}>
          <h2 className={cn('text-2xl font-semibold md:text-3xl')}>풍부한 우승 경험</h2>
        </header>
        <ul className={cn('carousel scroll-pl-16 gap-4 pl-16 md:gap-8')}>
          <li
            className={cn(
              'carousel-item flex h-[180px] w-[200px] flex-col items-center rounded-2xl bg-white p-4 md:h-72 md:w-80',
            )}
          >
            <h3
              className={cn(
                'flex h-full flex-col justify-between text-center text-sm font-medium md:text-xl',
              )}
            >
              <span>2021 챔프베이스볼 세미프로리그</span>
              <div className={cn('flex flex-col items-center')}>
                <Image
                  src={ChampLogo}
                  alt="챔프베이스볼리그 로고"
                  className={cn('size-[120px] md:size-[180px]')}
                />
              </div>
              <span>통합 우승</span>
            </h3>
          </li>
          <li
            className={cn(
              'carousel-item flex h-[180px] w-[200px] flex-col items-center rounded-2xl bg-white p-4 md:h-72 md:w-80',
            )}
          >
            <h3
              className={cn(
                'flex h-full flex-col justify-between text-center text-sm font-medium md:text-xl',
              )}
            >
              <span>2022 챔프베이스볼 토요리그</span>
              <div className={cn('flex flex-col items-center')}>
                <Image
                  src={ChampLogo}
                  alt="챔프베이스볼리그 로고"
                  className={cn('size-[120px] md:size-[180px]')}
                />
              </div>
              <span>전승 통합 우승</span>
            </h3>
          </li>
          <li
            className={cn(
              'carousel-item flex h-[180px] w-[200px] flex-col items-center rounded-2xl bg-white p-4 md:h-72 md:w-80',
            )}
          >
            <h3
              className={cn(
                'flex h-full flex-col justify-between text-center text-sm font-medium md:text-xl',
              )}
            >
              <span>2023 노원리그 3부토요 후반기</span>
              <div className={cn('flex flex-col items-center')}>
                <Image
                  src={NowonLogo}
                  alt="노원리그 로고"
                  className={cn('size-[120px] md:size-[180px]')}
                />
              </div>
              <span>준우승</span>
            </h3>
          </li>
          <li
            className={cn(
              'carousel-item flex h-[180px] w-[200px] flex-col items-center rounded-2xl bg-white p-4 md:h-72 md:w-80',
            )}
          >
            <h3
              className={cn(
                'flex h-full flex-col justify-between text-center text-sm font-medium md:text-xl',
              )}
            >
              <span>2024 노원리그 3부토요 전반기</span>
              <div className={cn('flex flex-col items-center')}>
                <Image
                  src={NowonLogo}
                  alt="노원리그 로고"
                  className={cn('size-[120px] md:size-[180px]')}
                />
              </div>
              <span>진행중</span>
            </h3>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default Introduction;
