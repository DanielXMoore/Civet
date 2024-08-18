#!/bin/bash

# Simple performance comparison

count=10
testFile=source/**/*.civet

function get_times {
  cmd=$1
  echo "Running $cmd on $testFile $count times"

  times=()
  for ((i = 1; i <= count; i++)) {
    time=$( (time $cmd -c $testFile -o /dev/null) 2>&1 | awk '/real/ {print $2}' | awk -Fm '{print $1*60+$2}' )
    echo $time
    times+=($time)
  }

  average=$(echo ${times[@]} | awk -f build/avg.awk)
}

get_times ./dist/civet new.out
new_avg=$average
get_times ./node_modules/.bin/civet old.out
old_avg=$average

echo New: $new_avg
echo Old: $old_avg
echo Ratio: $(awk "BEGIN { print $new_avg / $old_avg }")
