export type WebSocketMessage = {
  message: string;
  with_errors: boolean;
  processed: number;
  pending_to_review: number;
  total: number;
};
