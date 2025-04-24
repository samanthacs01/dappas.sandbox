'use client';

import useWebSocket from '@/core/providers/web-socket/use-web-socket';
import { getBookingFilesProcessingStatus } from '@/server/services/booking';
import { BookingFilesProcessingStatus } from '@/server/types/booking';
import { useEffect, useMemo, useState } from 'react';
import BookingInformationExtractor from '../components/BookingInformationExtractor';

const BookingInformationExtractorContainer = () => {
  const { message } = useWebSocket();
  const [information, setInformation] = useState<BookingFilesProcessingStatus>({
    total: 0,
    processed: 0,
  });
  const getExtractingInformation = async () => {
    const { data } = await getBookingFilesProcessingStatus();
    if (data) {
      setInformation(data);
    }
  };

  useEffect(() => {
    getExtractingInformation();
  }, []);

  const updatedInfo: BookingFilesProcessingStatus = useMemo(
    () => ({
      processed: message?.processed ?? information.processed,
      total: message?.total ?? information.total,
    }),
    [message, information],
  );

  return <BookingInformationExtractor information={updatedInfo} />;
};

export default BookingInformationExtractorContainer;
