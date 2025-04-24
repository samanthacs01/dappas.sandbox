package webapi

import (
	"errors"
	"reflect"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

func GinHandler[TInput any, TOutput any](handler func(*TInput) (*Result[TOutput], *Failure)) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var input TInput
		// Initialize input using reflection
		initializeInput(&input)
		if err := ctx.ShouldBindUri(&input); err != nil {
			problem := BadRequest(err)
			problem.Data.Instance = ctx.Request.RequestURI
			ctx.AbortWithStatusJSON(problem.Status, problem)
			return
		}
		if err := ctx.ShouldBindHeader(&input); err != nil {
			problem := BadRequest(err)
			problem.Data.Instance = ctx.Request.RequestURI
			ctx.AbortWithStatusJSON(problem.Status, problem)
			return
		}
		if err := ctx.ShouldBind(&input); err != nil {
			problem := BadRequest(err)
			problem.Data.Instance = ctx.Request.RequestURI
			ctx.AbortWithStatusJSON(problem.Status, problem)
			return
		}

		output, fails := handler(&input)
		processHandlerResult(ctx, output, fails)
	}
}

func GinHandlerWithWriter[TInput any](handler func(*TInput, gin.ResponseWriter) *Failure) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var input TInput
		// Initialize input using reflection
		initializeInput(&input)
		if err := ctx.ShouldBindUri(&input); err != nil {
			problem := BadRequest(err)
			problem.Data.Instance = ctx.Request.RequestURI
			ctx.AbortWithStatusJSON(problem.Status, problem)
			return
		}
		if err := ctx.ShouldBindHeader(&input); err != nil {
			problem := BadRequest(err)
			problem.Data.Instance = ctx.Request.RequestURI
			ctx.AbortWithStatusJSON(problem.Status, problem)
			return
		}
		if err := ctx.ShouldBind(&input); err != nil {
			problem := BadRequest(err)
			problem.Data.Instance = ctx.Request.RequestURI
			ctx.AbortWithStatusJSON(problem.Status, problem)
			return
		}

		fails := handler(&input, ctx.Writer)
		
		
		if fails != nil {
			problem := fails.Data
			problem.Instance = ctx.Request.RequestURI
			ctx.AbortWithStatusJSON(fails.Status, problem)
			return
		}
	}
}

func GinHandlerParamsLess[TOutput interface{}](handler func() (*Result[TOutput], *Failure)) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		output, fails := handler()
		processHandlerResult(ctx, output, fails)
	}
}

func processHandlerResult[TOutput interface{}](ctx *gin.Context, result *Result[TOutput], fails *Failure) {
	if fails != nil {
		problem := fails.Data
		problem.Instance = ctx.Request.RequestURI
		ctx.AbortWithStatusJSON(fails.Status, problem)
		return
	}
	
	if (result.Headers != nil) && len(result.Headers) > 0 {
		for k, v := range result.Headers {
			ctx.Header(k, v)
		}
	}
	
	ctx.JSON(result.Status, result.Data)
}

type OrderBy string //@name  OrderBy

type CSIntList string //@name  number[]

type CSStringList string //@name  string[]

func (c CSIntList) Values() []int {
	res := []int{}

	str := string(c)
	if len(str) > 0 {
		values := strings.Split(str, ",")
		for _, v := range values {
			if i, err := strconv.Atoi(v); err == nil {
				res = append(res, i)
			}
		}
	}
	return res
}

func (c CSStringList) Values() []string {
	res := []string{}

	str := string(c)
	if len(str) > 0 {
		str = strings.ToLower(str)
		values := strings.Split(str, ",")
		res = append(res, values...)
	}
	return res
}

func (c CSStringList) LiteralValues() []string {
	res := []string{}

	str := string(c)
	if len(str) > 0 {
		values := strings.Split(str, ",")
		res = append(res, values...)
	}
	return res
}

func (c OrderBy) Values() []struct{ Field, Direction string } {
	// order by will by -company and this will be return asc and company
	str := string(c)
	str = strings.ToLower(str)
	values := strings.Split(str, ",")
	results := make([]struct{ Field, Direction string }, 0)
	for _, v := range values {
		if len(v) > 0 {
			order := v[0]
			field := v
			direction := "asc"
			if order == '-' {
				direction = "desc"
				field = v[1:]
			} else if order == '+' {
				field = v[1:]
			}
			results = append(results, struct{ Field, Direction string }{Field: field, Direction: direction})
		}
	}
	return results
}

func initializeInput(input interface{}) {
	val := reflect.ValueOf(input).Elem()
	typ := val.Type()

	for i := 0; i < val.NumField(); i++ {
		field := val.Field(i)
		fieldType := typ.Field(i)

		if field.Kind() == reflect.Ptr && field.IsNil() {
			switch fieldType.Type.Elem().Kind() {
			case reflect.Int:
				defaultValue := 0
				field.Set(reflect.ValueOf(&defaultValue))
			case reflect.String:
				defaultValue := ""
				field.Set(reflect.ValueOf(&defaultValue))
			case reflect.Struct:
				if fieldType.Type.Elem() == reflect.TypeOf(time.Time{}) {
					defaultValue := time.Time{}
					field.Set(reflect.ValueOf(&defaultValue))
				}
			case reflect.Slice:
				field.Set(reflect.MakeSlice(fieldType.Type, 0, 0))
			}
		}
	}
}

type ValidateToken func(string, uint) bool
type UserIdSetter func(uint)

func Authorize(jwtKey []byte, validate ValidateToken, roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			problem := Unauthorized(errors.New("authorization header is required"))
			c.AbortWithStatusJSON(problem.Status, problem.Data)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			problem := Unauthorized(errors.New("bearer token is required"))
			c.AbortWithStatusJSON(problem.Status, problem.Data)
			return
		}

		claims := &jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		if err != nil || !token.Valid {
			problem := Unauthorized(errors.New("invalid token"))
			c.AbortWithStatusJSON(problem.Status, problem.Data)
			return
		}
		userId := uint(((*claims)["id"]).(float64))

		if !validate(tokenString, userId) {
			problem := Unauthorized(errors.New("invalid token"))
			c.AbortWithStatusJSON(problem.Status, problem.Data)
			return
		}

		userRole := ((*claims)["role"]).(string)
		authorized := len(roles) == 0
		for _, role := range roles {
			if userRole == role {
				authorized = true
				break
			}
		}

		if !authorized {
			problem := Unauthorized(errors.New("you don't have permission to access this resource"))
			c.AbortWithStatusJSON(problem.Status, problem.Data)
			return
		}
		// Continue if the user has the required role
		c.Next()
	}
}
