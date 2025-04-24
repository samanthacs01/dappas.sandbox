package builders

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
)


type operators string

const (
	equal            operators = "="
	notEqual         operators = "!="
	greaterThan      operators = ">"
	greaterOrEqual   operators = ">="
	lessThan         operators = "<"
	lessOrEqual      operators = "<="
	like             operators = "ILIKE"
	notLike          operators = "NOT ILIKE"
	isNull           operators = "IS NULL"
	isNotNull        operators = "IS NOT NULL"
	in               operators = "IN"
	notIn            operators = "NOT IN"
	between          operators = "BETWEEN"
)

type baseQueryBuilder struct {
	tableName  string
	conditions []string
	args       []interface{}
}

func (qb *baseQueryBuilder) NextArgument() int {
	return len(qb.args) + 1
}

func (qb *baseQueryBuilder) GetTableOrAlias() string {
	table := qb.tableName
	parts := strings.Split(qb.tableName, " AS ")
	if len(parts) > 1 {
		table = parts[1]
	} else {
		parts = strings.Split(qb.tableName, " ")
		if len(parts) > 1 {
			table = parts[1]
		}
	}
	return table
}
var columnNameRegex = regexp.MustCompile(`^["a-zA-Z_][a-zA-Z0-9_]*$`)
func (qb *baseQueryBuilder) addTable(field string) string {
	table := qb.GetTableOrAlias()
	
	if strings.Contains(field, ".") || strings.Contains(field, "(") || table == "" || field == "*" || strings.HasPrefix(field, "'"){
		return field
	}

	if columnNameRegex.MatchString(field) {
        return fmt.Sprintf("%s.%s", table, field)
    }

    return field
}

func (qb *baseQueryBuilder) addCondition(field string, operator operators, value interface{}) {
	qb.conditions = append(qb.conditions, fmt.Sprintf("%s %s $%d", qb.addTable(field), operator, qb.NextArgument()))
	qb.args = append(qb.args, value)
}

func (qb *baseQueryBuilder) Equal(field string, value interface{}) {
	qb.addCondition(field, equal, value)
}

func (qb *baseQueryBuilder) NotEqual(field string, value interface{}) {
	qb.addCondition(field, notEqual, value)
}

func (cb *baseQueryBuilder) InInt(field string, values []int) {
	params := []string{}
	for _, val := range values {
		params = append(params, `$`+strconv.Itoa(cb.NextArgument()))
		cb.args = append(cb.args, val)
	}
	cb.conditions = append(cb.conditions, fmt.Sprintf("%s IN (%s)", cb.addTable(field), strings.Join(params, ", ")))
}

func (qb *baseQueryBuilder) AnyInt(field string, values []int) {
    strArray := make([]string, len(values))

    for i, num := range values {
        strArray[i] = strconv.Itoa(num)
    }
	
	qb.conditions = append(qb.conditions, fmt.Sprintf("%s = any('{%s}'::int[])", qb.addTable(field), strings.Join(strArray, ", ")))
}

func (qb *baseQueryBuilder) AnyString(field string, values []string) {
	qb.conditions = append(qb.conditions, fmt.Sprintf("%s = any(array['%s'])", qb.addTable(field), strings.Join(values, "', '")))
}

func (cb *baseQueryBuilder) InString(field string, values []string) {
	params := []string{}
	fmt.Println("IN", values)
	for _, val := range values {
		params = append(params, `$`+strconv.Itoa(cb.NextArgument()))
		cb.args = append(cb.args, val)
	}
	cb.conditions = append(cb.conditions, fmt.Sprintf("%s IN (%s)", cb.addTable(field), strings.Join(params, ", ")))
}

func (cb *baseQueryBuilder) NotIN(field string, values interface{}) {
	cb.conditions = append(cb.conditions, fmt.Sprintf("%s NOT IN ($%d)", cb.addTable(field), cb.NextArgument()))
	cb.args = append(cb.args, values)
}
func (cb *baseQueryBuilder) GreaterThan(field string, value interface{}) {
	cb.conditions = append(cb.conditions, fmt.Sprintf("%s > $%d", cb.addTable(field), cb.NextArgument()))
	cb.args = append(cb.args, value)
}
func (cb *baseQueryBuilder) GreaterOrEqualThan(field string, value interface{}) {
	cb.conditions = append(cb.conditions, fmt.Sprintf("%s >= $%d", cb.addTable(field), cb.NextArgument()))
	cb.args = append(cb.args, value)
}
func (cb *baseQueryBuilder) LessThan(field string, value interface{}) {
	cb.conditions = append(cb.conditions, fmt.Sprintf("%s < $%d", cb.addTable(field), cb.NextArgument()))
	cb.args = append(cb.args, value)
}
func (cb *baseQueryBuilder) LessOrEqualThan(field string, value interface{}) {
	cb.conditions = append(cb.conditions, fmt.Sprintf("%s <= $%d", cb.addTable(field), cb.NextArgument()))
	cb.args = append(cb.args, value)
}

func (cb *baseQueryBuilder) Between(field string, value1, value2 interface{}) {
	cb.conditions = append(cb.conditions, fmt.Sprintf("%s BETWEEN $%d AND $%d", cb.addTable(field), cb.NextArgument(), cb.NextArgument() + 1))
	cb.args = append(cb.args, value1, value2)
}

func (cb *baseQueryBuilder) IsNull(field string) {
	cb.conditions = append(cb.conditions, fmt.Sprintf("%s IS NULL", cb.addTable(field)))
}

func (cb *baseQueryBuilder) RawCondition(condition string) {
	cb.conditions = append(cb.conditions, condition)
}

func (cb *baseQueryBuilder) IsNotNull(field string) {
	cb.conditions = append(cb.conditions, fmt.Sprintf("%s IS NOT NULL", cb.addTable(field)))
}

func (cb *baseQueryBuilder) Like(field string, value string) {
    likeValue := fmt.Sprintf("%%%s%%", value)
    cb.conditions = append(cb.conditions, fmt.Sprintf("%s ILIKE $%d", cb.addTable(field), cb.NextArgument()))
    cb.args = append(cb.args, likeValue)
}

func (cb *baseQueryBuilder) NotLike(field string, value string) {
	likeValue := fmt.Sprintf("%%%s%%", value)
	cb.conditions = append(cb.conditions, fmt.Sprintf("%s NOT ILIKE $%d", cb.addTable(field), cb.NextArgument()))
	cb.args = append(cb.args, likeValue)
}

func (qb *baseQueryBuilder) Auditable(q string, args []interface{}, action string, userId *uint) (string, []interface{}) {
	
	columns := []string{"created_by", "action", "table_name", "query", "args"}
	values := make([]string, len(columns))
	for i := range columns {
		values[i] = fmt.Sprintf("$%d", i+1)
	}
	
	var strArgs []string
    for _, arg := range args {
        strArgs = append(strArgs, fmt.Sprintf("%v", arg))
    }
	
	_userId := -1;
	if userId != nil {
		_userId = int(*userId)
	}

	_args :=  []interface{}{_userId, "UPDATE", qb.tableName, q, strings.Join(strArgs, ", ")}

	query := fmt.Sprintf("INSERT INTO db_logger (%s) VALUES (%s) RETURNING id", strings.Join(columns, ", "), strings.Join(values, ", "))
	return query, _args
}