import RegisterExpenseFormContainer from '@/modules/admin/payable/modules/productions/components/form/register-expense/RegisterExpenseFormContainer';

type Props = { params: Promise<{ id: number }> };

export default async function Page(props: Readonly<Props>) {
  const params = await props.params;
  return <RegisterExpenseFormContainer production_id={+params.id} />;
}
