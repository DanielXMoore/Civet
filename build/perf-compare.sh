#!/bin/bash

# Simple performance comparison

count=10
testFile=source/lib.civet

function get_times {
  cmd=$1
  file=$2
  echo "Running $cmd on $testFile $count times"
  true > "$file"
  for ((i = 1; i <= count; i++)) {
    (time $cmd < $testFile > /dev/null) 2>&1 | awk '/real/ {print $2}' | awk -Fm '{print $1*60+$2}' | tee -a "$file"
  }
}

get_times ./dist/civet new.out
get_times ./node_modules/.bin/civet old.out

echo "New"
awk --file=build/avg.awk new.out
echo "Old"
awk --file=build/avg.awk old.out
