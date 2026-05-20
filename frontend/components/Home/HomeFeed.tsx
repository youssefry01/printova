import { FC } from 'react';
import PartCard from './PartCard';
import { Part } from '@/types';

const HomeFeed: FC<{ parts: Part[] }> = ({ parts }) => {

  return (
    <section className='flex flex-col lg:flex-row w-full lg:px-auto'>
      <ul className='flex flex-wrap justify-center items-center w-full px-10 lg:flex-wrap lg:mb-0'>

        {parts.map(part => 
        
          <PartCard part={part} key={part.partId} />

        )}

      </ul>
    </section>
  )
}

export default HomeFeed;