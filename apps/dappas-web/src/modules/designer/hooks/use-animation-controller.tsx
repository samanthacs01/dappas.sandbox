'use client';

import { useCallback, useState } from 'react';

const useAnimationController = () => {
  const [playAnimation, setPlayAnimation] = useState<boolean>(false);
  const [playRotation, setPlayRotation] = useState<boolean>(true);

  const onPlayAnimation = useCallback(() => {
    setPlayAnimation((prev) => !prev);
  }, []);

  const onStopModelRotation = useCallback(() => {
    setPlayRotation((prev) => !prev);
  }, []);

  return {
    playAnimation,
    playRotation,
    onPlayAnimation,
    onStopModelRotation,
  };
};

export default useAnimationController;
