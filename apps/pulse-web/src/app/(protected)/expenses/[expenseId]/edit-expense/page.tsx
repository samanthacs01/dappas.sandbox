import EditExpenseContainer from "@/modules/admin/expenses/containers/EditExpenseContainer";

type EditExpenseProps = {
  params: Promise<{ expenseId: string }>;
};

export default async function Page(params: EditExpenseProps) {
  const { expenseId } = await params.params;
  return <EditExpenseContainer {...{ expenseId }} />;
}
