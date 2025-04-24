package repositories

const receivablesOverdueValuesQuery = `SELECT grouping, grouping_details, total, "order" FROM get_receivables_overdue(TO_DATE($1, $3), TO_DATE($2, $3))`
