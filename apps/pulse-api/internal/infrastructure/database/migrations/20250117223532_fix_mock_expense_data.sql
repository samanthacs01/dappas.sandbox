-- +goose Up
UPDATE expenses SET "month"=(CASE 
	WHEN LOWER("month")='jan' OR LOWER("month")='january'  THEN '1'
	WHEN LOWER("month") ='feb'OR LOWER("month")='february'THEN '2'
	WHEN LOWER("month")='mar' OR LOWER("month")='march'    THEN '3'
	WHEN LOWER("month")='apr' OR LOWER("month")='april'    THEN '4'
	WHEN LOWER("month")='may' OR LOWER("month")='may'      THEN '5'
	WHEN LOWER("month")='jun' OR LOWER("month")='june'     THEN '6'
	WHEN LOWER("month")='jul' OR LOWER("month")='july'     THEN '7'
	WHEN LOWER("month")='aug' OR LOWER("month")='august'   THEN '8'
	WHEN LOWER("month")='sep' OR LOWER("month")='september'THEN '9'
	WHEN LOWER("month")='oct' OR LOWER("month")='october'  THEN '10'
	WHEN LOWER("month")='nov' OR LOWER("month")='november' THEN '11'
	WHEN LOWER("month")='dec' OR LOWER("month")='december' THEN '12'
ELSE "month" END);
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
