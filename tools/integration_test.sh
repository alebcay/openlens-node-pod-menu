#!/bin/bash

set -exo pipefail

[ -z "${EXTENSION_PATH}" ] && echo "EXTENSION_PATH environment variable must be set" && exit 1

DIR=$(mktemp -d)
git clone https://github.com/lensapp/lens ${DIR}/lens
[ ! -z "${LENS_REF}" ] && git -C ${DIR}/lens checkout ${LENS_REF}
cp tools/extensions.tests.ts ${DIR}/lens/packages/open-lens/integration/__tests__/extensions.tests.ts
TARGET_FILE="${DIR}/lens/packages/open-lens/package.json" node tools/remove_extra_lens_targets.js

pushd ${DIR}/lens
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi

    npm run build:app

    # If left present, the snap package will be mistaken for an obsolete Jest snapshot
    rm -f packages/open-lens/dist/*.snap

    cd packages/open-lens && npx jest --forceExit -- integration/__tests__/extensions.tests.ts
popd

rm -rf ${DIR}
