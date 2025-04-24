import { DataSeries } from '@/server/types/overview';
import LinearBaseChart from '../LinearBaseChart';

type Props = {
  data: DataSeries[];
};

const OverviewRevenueChart: React.FC<Props> = ({ data }) => {
  return <LinearBaseChart data={data} title="Revenue" />;
};

export default OverviewRevenueChart;
