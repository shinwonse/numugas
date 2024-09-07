'use client';

import { cn } from '@numugas/util';
import { motion } from 'framer-motion';
import Image from 'next/image';

import Logo from '../../../../public/logo.png';

const Introduction = () => {
  return (
    <div className={cn('flex flex-col gap-6')}>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{
          ease: 'easeInOut',
          duration: 2,
          x: { duration: 1 },
        }}
        className={cn('flex flex-col items-center px-4 md:px-16')}
      >
        <Image src={Logo} alt="담장NUMUGAS 로고" width={300} height={300} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{
          ease: 'easeInOut',
          duration: 2,
          x: { duration: 1 },
        }}
        className={cn('flex flex-col gap-10')}
      >
        <header className={cn('px-4 md:px-16')}>
          <h2 className={cn('text-3xl font-semibold md:text-5xl')}>풍부한 우승 경험</h2>
        </header>
        <div className={cn('carousel gap-10')}>
          <div className={cn('carousel-item h-72 w-80 rounded-2xl bg-white p-2')}>
            <h3>
              <span>🏆 2021 챔프베이스볼 세미프로리그</span>
              <br />
              <span>통합 우승</span>
            </h3>
          </div>
          <div className={cn('carousel-item h-72 w-80 rounded-2xl bg-white p-2')}>
            <h3>
              <span>🏆 2022 챔프베이스볼 토요리그 전승 통합 우승</span>
              <br />
              <span>통합 우승</span>
            </h3>
          </div>
          <div className={cn('carousel-item h-72 w-80 rounded-2xl bg-white p-2')}>
            <h3>
              <span>🏆 2023 노원리그 3부토요 후반기 준우승</span>
              <br />
              <span>통합 우승</span>
            </h3>
          </div>
          <div className={cn('carousel-item h-72 w-80 rounded-2xl bg-white p-2')}>
            <h3>
              <span>🏆 2023 노원리그 3부토요 후반기 준우승</span>
              <br />
              <span>통합 우승</span>
            </h3>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{
          ease: 'easeInOut',
          duration: 2,
          x: { duration: 1 },
        }}
        className={cn('flex flex-col')}
      >
        <header className={cn('px-4 md:px-16')}>
          <h2 className={cn('text-3xl font-semibold md:text-5xl')}>압도적인 공격력</h2>
        </header>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{
          ease: 'easeInOut',
          duration: 2,
          x: { duration: 1 },
        }}
        className={cn('flex flex-col')}
      >
        <header className={cn('px-4 md:px-16')}>
          <h2 className={cn('text-3xl font-semibold md:text-5xl')}>강력한 투수진</h2>
        </header>
      </motion.div>
    </div>
  );
};

export default Introduction;
