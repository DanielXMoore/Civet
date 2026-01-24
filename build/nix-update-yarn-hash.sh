#!/usr/bin/env bash

# a script to update 'yarnDepsHash' in flake.nix for a given output
# usage: ./build/nix-update-yarn-hash.sh [cli|ls]
# defaults to 'cli' if no argument is provided

set -euo pipefail
log() {
  >&2 echo -e "${@-}"
}

OUTPUT_NAME="${1:-cli}"

log "updating yarnDepsHash for .#$OUTPUT_NAME in flake.nix\n"

sed -i "
/\<$OUTPUT_NAME\> =/{ # match on 'cli =' or 'ls =', etc
  :a; # code label for branching
  N;  # consume the next line
  /yarnDepsHash/!ba; # if it doesn't match 'yarnDepsHash', goto :a (consume next line)
  s/yarnDepsHash.*/#@replaceme@/ # if it does, replace it with a placeholder
}" flake.nix || {
  log "couldn't find yarnDepsHash in flake.nix, something is very wrong"
  exit 1
}

log "an expected hash mismatch error will be printed below..."
HASH=$(
  { nix \
      --extra-experimental-features nix-command \
      --extra-experimental-features flakes \
      build .#"$OUTPUT_NAME" --no-link || true; } 2>&1 \
  | tee /dev/stderr | sed -n 's/\s*got:\s*\(.*\)/\1/p'
)
if [ "$HASH" = "" ]; then 
  log "\nfailed to get yarnDepsHash for $OUTPUT_NAME"
  exit 1
fi

sed -i 's!#@replaceme@!yarnDepsHash = "'"$HASH"'";!' flake.nix || {
  log "failed to substitute yarnDepsHash in flake.nix, how??"
  exit 1
}

if
  nix \
    --extra-experimental-features nix-command \
    --extra-experimental-features flakes \
    build .#"$OUTPUT_NAME" --no-link
then
  log "\nsuccessfully updated yarnDepsHash for $OUTPUT_NAME to $HASH\n"
  PAGER='' git diff flake.nix
  git add flake.nix
else
  log "\ncouldn't build $OUTPUT_NAME after updating yarnDepsHash"
  # shellcheck disable=SC2016
  log 'you can run `git restore -p flake.nix` to restore the old hash'
  exit 1
fi
