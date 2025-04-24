import { DataSeries } from '@/server/types/overview';
import LinearBaseChart from '../LinearBaseChart';

type Props = {
  data: DataSeries[];
};

const OverviewDaysPayablesOutChart: React.FC<Props> = ({ data }) => {
  return <LinearBaseChart data={data} title="Days Payable Outstanding" />;
};

export default OverviewDaysPayablesOutChart;
