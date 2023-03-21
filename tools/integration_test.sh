#!/bin/bash

set -exo pipefail

[ -z "${EXTENSION_PATH}" ] && echo "EXTENSION_PATH environment variable must be set" && exit 1

TEST_TMPDIR="$(mktemp -d)"
git clone https://github.com/lensapp/lens "${TEST_TMPDIR}/lens"
[ -n "${LENS_REF}" ] && git -C "${TEST_TMPDIR}/lens" checkout "${LENS_REF}"

if [ -d "${TEST_TMPDIR}/lens/packages/open-lens" ]; then
    OPENLENS_ROOT_DIR="${TEST_TMPDIR}/lens/packages/open-lens"
else
    OPENLENS_ROOT_DIR="${TEST_TMPDIR}/lens"
fi

cp tools/extensions.tests.ts "${OPENLENS_ROOT_DIR}/integration/__tests__/extensions.tests.ts"
TARGET_FILE="${OPENLENS_ROOT_DIR}/package.json" node tools/remove_extra_lens_targets.js

pushd "${TEST_TMPDIR}/lens"
    if [ -f "Makefile" ]; then
        make build
    else
        if [ -f "package-lock.json" ]; then
            npm ci
        else
            npm install
        fi

        npm run build:app
    fi

    # If left present, the snap package will be mistaken for an obsolete Jest snapshot
    rm -f "${OPENLENS_ROOT_DIR}"/dist/*.snap

    cd "${OPENLENS_ROOT_DIR}" && npx jest --forceExit -- integration/__tests__/extensions.tests.ts
popd

rm -rf "${TEST_TMPDIR}"
