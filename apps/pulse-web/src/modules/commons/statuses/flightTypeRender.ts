import { FlightStatus } from '@/server/types/booking';

const statusMap: Record<FlightStatus, string> = {
  pending: 'Pending',
  invoiced: 'Invoiced',
};

export const flightTypeRender = (type: FlightStatus): string => {
  return statusMap[type] || type;
};
