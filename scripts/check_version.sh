#!/usr/bin/env bash

set -o errexit # Makes script fail on error
set -o nounset # Makes script fail on accessing unset variable
set -o pipefail # Makes pipeline commands fail if at least one command in the pipeline failes
if [[ "${TRACE-0}" == "1" ]]; then set -o xtrace; fi # Helps debugging the script using `TRACE=1 ./script.sh`

cd "$(dirname "$0")"

main() {
    # Get the current version from package.json
    current_version=$(node -p "require('../package.json').version")
    echo "Current version: $current_version"

    # Get the last released version from Git tags
    last_version=$(git describe --tags --abbrev=0)
    echo "Last released version: $last_version"

    # Check if the versions are valid semver
    if [ -z "$last_version" ]; then
        echo "No previous version found. This is the first release."
        exit 0  # Allow the workflow to proceed for the first release
    else
        # Use semver to compare versions
        if [ $(node -p "require('semver').gt('$current_version', '$last_version')") = "false" ]; then
            echo "Error: Current version ($current_version) is not greater than last version ($last_version)."
            exit 1  # Fail the script
        fi
    fi

    echo "Version check passed. Proceeding with the deployment."
}

main "$@"
