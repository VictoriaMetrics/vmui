REPO=victoriametrics/ui

BUILDINFO_TAG ?= $(shell echo $$(git describe --long --all | tr '/' '-')$$( \
	      git diff-index --quiet HEAD -- || echo '-dirty-'$$(git diff-index -u HEAD | openssl sha1 | cut -c 10-17)))

PKG_TAG ?= $(shell git tag -l --points-at HEAD)
ifeq ($(PKG_TAG),)
PKG_TAG := $(BUILDINFO_TAG)
endif

package-base-image:
	(docker image ls --format '{{.Repository}}:{{.Tag}}' | grep -q builder-image-vmui) \
	|| docker build -t builder-image-vmui -f packages/victoria-metrics-ui/Docker-build .

package-via-docker: package-base-image
	docker run --rm \
          --user $(shell id -u):$(shell id -g) \
         --mount type=bind,src="$(shell pwd)",dst=/build \
         -w /build/packages/victoria-metrics-ui \
         --entrypoint=/bin/bash \
         builder-image-vmui -c "npm install && npm run build"

release-via-docker: package-via-docker
	echo ${PKG_TAG}
	docker build -t ${REPO}:latest -f packages/victoria-metrics-ui/Dockerfile-web ./packages/victoria-metrics-ui
	docker tag ${REPO}:latest ${REPO}:${PKG_TAG}
	docker create --name ui-build-${PKG_TAG} ${REPO}:${PKG_TAG}
	docker cp ui-build-${PKG_TAG}:/app/web $(shell pwd)/ui-web-amd64
	docker cp ui-build-${PKG_TAG}:/app/web-windows $(shell pwd)/ui-web-windows
	zip -r ui-web-amd64.zip ui-web-amd64
	zip -r ui-web-windows.zip ui-web-windows
	cd packages/victoria-metrics-ui/ && zip -r static.zip build
	mv packages/victoria-metrics-ui/static.zip $(shell pwd)/static.zip
	docker rm  ui-build-${PKG_TAG}

latest-push: package-via-docker
	docker push ${REPO}

release-push: release-via-docker
	docker push ${REPO}:${PKG_TAG}
