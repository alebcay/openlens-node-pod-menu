#!/bin/bash

set -exo pipefail

[ -z "${EXTENSION_PATH}" ] && echo "EXTENSION_PATH environment variable must be set" && exit 1

DIR=$(mktemp -d)
git clone https://github.com/lensapp/lens ${DIR}/lens
[ ! -z "${LENS_REF}" ] && git -C ${DIR}/lens checkout ${LENS_REF}
cp tools/extensions.tests.ts ${DIR}/lens/integration/__tests__/extensions.tests.ts

pushd ${DIR}/lens
    make build
    npx jest -- integration/__tests__/extensions.tests.ts
popd

rm -rf ${DIR}
