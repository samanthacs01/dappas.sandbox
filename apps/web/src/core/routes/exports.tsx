import React from 'react';

const LandingContainer = React.lazy(
  () => import('@/modules/landing/containers/landing-container'),
);

export default { LandingContainer };
