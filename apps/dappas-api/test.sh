#!/bin/bash
ROOT_DIR=$(pwd)


execute_tests() {
  local DIR="$1"
  local COVERAGE="$2" # "none", "basic", "profile"
  echo "-----------------------------------------"
  echo "Testing module on: $DIR"
  cd "$DIR" || return 1
  case "$COVERAGE" in
    "none")
      go test ./...
      ;;
    "basic")
      go test -cover ./...
      ;;
    "profile")
      COVER_FILE="$ROOT_DIR/coverage_${DIR//\//_}.out"
      go test -coverprofile="$COVER_FILE" ./...
      echo "Coverage profile: $COVER_FILE"
      ;;
    *)
      echo "Invalid coverage mode: $COVERAGE. Executing without coverage."
      go test ./...
      ;;
  esac
  cd "$ROOT_DIR" || return 1
}

echo "Executing in dappas-api:"
execute_tests "$ROOT_DIR" "$1"


echo "Testing packages in dappas-api:"
find "$ROOT_DIR/pkg" -maxdepth 3 -type f -name "go.mod" -print0 | while IFS= read -r -d $'\0' MOD_FILE; do
  MOD_DIR=$(dirname "$MOD_FILE")
  execute_tests "$MOD_DIR" "$1"
done

echo "-----------------------------------------"
echo "All test was executed."

exit 0