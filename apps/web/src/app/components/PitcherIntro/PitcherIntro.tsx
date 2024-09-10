import { cn } from '@numugas/util';
import { motion } from 'framer-motion';
import Image from 'next/image';

import 김선호 from '../../../../public/김선호.png';
import 양형석 from '../../../../public/양형석.png';

const PitcherIntro = () => {
  return (
    <div className={cn('flex max-w-full flex-col px-4')}>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{
          ease: 'easeInOut',
          duration: 2,
          x: { duration: 1 },
        }}
      >
        <Image src={김선호} alt="김선호" className={cn('w-[350px] md:w-[500px]')} />
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
        className={cn('flex flex-row justify-end')}
      >
        <Image src={양형석} alt="양형석" className={cn('w-[250px] md:w-[350px]')} />
      </motion.div>
    </div>
  );
};

export default PitcherIntro;
