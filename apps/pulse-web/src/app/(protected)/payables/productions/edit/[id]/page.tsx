import ErrorDisplay from '@/core/components/common/error/error-display';
import PayableProductionsContainer from '@/modules/admin/payable/modules/productions/containers/PayableProductionsContainer';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page(props: Readonly<Props>) {
  const params = await props.params;
  if (!params.id)
    return (
      <ErrorDisplay
        href="/payables/productions"
        link_text="Return to Productions"
        message="We couldn't load the production. Please try again later."
      />
    );
  return <PayableProductionsContainer id={params.id} />;
}
