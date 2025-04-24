import ChartRendering from '@/core/components/common/chart/chart-rendering';
import { ProductionDetailsChartsConfig } from './ProductionDetailsChartsConfig';

const ProductionsDetailsOverview = () => {
  const charts = ProductionDetailsChartsConfig();
  return <ChartRendering charts={charts} />;
};

export default ProductionsDetailsOverview;
