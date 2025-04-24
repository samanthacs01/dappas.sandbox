import { DataSeries } from '@/server/types/overview';
import LinearBaseChart from '../LinearBaseChart';

type Props = {
  data: DataSeries[];
};

const OverviewDaysSalesOutChart: React.FC<Props> = ({ data }) => {
  return <LinearBaseChart data={data} title="Days Sales Outstanding" />;
};

export default OverviewDaysSalesOutChart;
