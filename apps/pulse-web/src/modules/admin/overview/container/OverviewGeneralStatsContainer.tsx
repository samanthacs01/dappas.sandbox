import { getGeneralOverviewStats } from '@/server/services/overview';
import { SearchParams } from '@/server/types/params';
import React from 'react';
import GeneralOverviewStats from '../components/charts/GeneralOverviewStats';

const OverviewGeneralStatsContainer = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const generalStats = await getGeneralOverviewStats(searchParams);
  if (!generalStats.success || !generalStats.data) {
    return (
      <div className="text-center">
        Sorry, an error occurred. Please try again later.
      </div>
    );
  }
  return <GeneralOverviewStats generalStats={generalStats.data} />;
};

export default OverviewGeneralStatsContainer;
