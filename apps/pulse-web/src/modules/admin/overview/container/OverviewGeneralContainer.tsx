import { SearchParams } from '@/server/types/params';
import React, { useCallback } from 'react';
import OverviewGeneralStatsContainer from './OverviewGeneralStatsContainer';
import GeneralTotalRevenueContainer from './GeneralTotalRevenueContainer';
import GeneralGrossMarginContainer from './GeneralGrossMarginContainer';
import GeneralDsoContainer from './GeneralDsoContainer';
import GeneralDpoContainer from './GeneralDpoContainer';

type Props = {
  searchParams: SearchParams;
  direction?: 'horizontal' | 'vertical';
};

const OverviewGeneralContainer = ({
  searchParams,
  direction = 'horizontal',
}: Props) => {
  const renderChart = useCallback(
    (chart: string) => {
      switch (chart) {
        case 'days-sales-outstanding':
          return <GeneralDsoContainer {...{ searchParams }} />;
        case 'days-payable-outstanding':
          return <GeneralDpoContainer {...{ searchParams }} />;
        case 'gross-margin':
          return <GeneralGrossMarginContainer {...{ searchParams }} />;
        default:
          return <GeneralTotalRevenueContainer {...{ searchParams }} />;
      }
    },
    [searchParams.general_chart],
  );
  return (
    <div
      className={`${direction === 'horizontal' ? 'grid grid-cols-2 gap-4' : 'space-y-4 '}`}
    >
      <OverviewGeneralStatsContainer {...{ searchParams }} />
      {renderChart(searchParams.general_chart as string)}
    </div>
  );
};

export default OverviewGeneralContainer;
