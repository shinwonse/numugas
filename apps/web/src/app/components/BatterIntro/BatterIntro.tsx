import { cn } from '@numugas/util';
import { motion } from 'framer-motion';
import Image from 'next/image';

import 김관휘 from '../../../../public/김관휘.png';
import 정종현 from '../../../../public/정종현.png';

const BatterIntro = () => {
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
        <Image src={정종현} alt="정종현" className={cn('w-[300px] md:w-[450px]')} />
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
        <Image src={김관휘} alt="김관휘" className={cn('w-[200px] md:w-[300px]')} />
      </motion.div>
    </div>
  );
};

export default BatterIntro;
