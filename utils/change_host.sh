#!/bin/bash

files_to_change=$(grep -r "localhost:8000" ../frontend/ | cut -f 1 -d : | uniq | sort)

if [ $# -eq 0 ]; then
    echo "Usage: $0 [host]"
    exit
fi

ESCAPED_REPLACE=$(printf '%s\n' "$1" | sed -e 's/[\/&]/\\&/g')

for i in $files_to_change; do
    output=$(sed "s/http:\/\/localhost:8000/$ESCAPED_REPLACE/g" $i)
    echo "$output" > $i
done
