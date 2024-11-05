#!/usr/bin/env bash

set -o errexit # Makes script fail on error
set -o nounset # Makes script fail on accessing unset variable
set -o pipefail # Makes pipeline commands fail if at least one command in the pipeline failes
if [[ "${TRACE-0}" == "1" ]]; then set -o xtrace; fi # Helps debugging the script using `TRACE=1 ./script.sh`

if [[ "${1-}" =~ ^-*h(elp)?$ ]]; then
    echo 'Usage: ./check_version.sh current_version last_version

Compares semantic versions and fails if current_version is not greater than last_version.

'
    exit
fi

cd "$(dirname "$0")"

main() {
    current_version=$1
    last_version=$2

    echo "Comparing versions $current_version vs. $last_version"

    # Check if the versions are valid semver
    if [ -z "$last_version" ]; then
        echo "No previous version found. This is the first release."
        exit 0  # Allow the workflow to proceed for the first release
    else
        # Use semver to compare versions
        if [ $(node -p "require('semver').gt('$current_version', '$last_version')") = "false" ]; then
            echo "Check failed. Current version ($current_version) is not greater than last version ($last_version)."
            exit 1  # Fail the script
        fi
    fi

    echo "Version check passed. Proceeding with the deployment."
}

main "$@"
