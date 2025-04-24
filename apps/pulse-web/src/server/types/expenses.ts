/*
 *Represent the expenses in expenses session
 */
export type Expenses = {
  id: number;
  production_name: string;
  year: string;
  month: string;
  production_id: number;
  total_deduction: number;
};

/*
 * Represent a new expense
 */

export type NewExpenseDTO = {
  files: File[];
  month: number;
  production_id: number;
  total_deduction: number;
};

export type Expense = NewExpenseDTO & {
  id: number;
  year: string;
  production_name: string;
};
