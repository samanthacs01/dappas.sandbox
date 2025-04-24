import React from 'react';
import CardSkeleton from './card-skeleton';

interface Props {
  length: number;
}

const MultipleSkeletonCards = ({ length }: Props) => {
  return (
    <div className="flex gap-4 overflow-x-auto overflow-y-hidden w-full p-2">
      {[...Array(length)].map((_, index) => (
        <CardSkeleton key={`card-skeleton-${index}`} />
      ))}
    </div>
  );
};

export default MultipleSkeletonCards;
