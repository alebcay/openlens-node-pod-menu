install-deps:
	npm ci --prefix src/kube-object-event-status
	npm ci --prefix src/metrics-cluster-feature
	npm ci --prefix src/node-menu
	npm ci --prefix src/pod-menu

build: install-deps
	mkdir dist
	npm run --prefix src/kube-object-event-status build ${PWD}/dist
	npm run --prefix src/metrics-cluster-feature build ${PWD}/dist
	npm run --prefix src/node-menu build ${PWD}/dist
	npm run --prefix src/pod-menu build ${PWD}/dist

clean:
	rm -rf dist \
		src/kube-object-event-status/dist src/kube-object-event-status/node_modules \
		src/metrics-cluster-feature/dist src/metrics-cluster-feature/node_modules \
		src/node-menu/dist src/node-menu/node_modules \
		src/pod-menu/dist src/pod-menu/node_modules
