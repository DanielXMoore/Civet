#!/bin/bash

set -euo pipefail

c8 mocha "$@"
tsc
