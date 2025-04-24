import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';

export const LinkSentCard = () => {
  return (
    <Card className="mx-auto max-w-sm ">
      <CardHeader className="pt-6">
        <CardTitle className="text-lg">Recovery link sent</CardTitle>
        <CardDescription className="pt-2 pr-4">
          We have sent a message to your email address with a recovery link.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
