include .env

DOCKER_IMAGE_NAME="lambda-node-canvas"
#DOCKER_IMAGE_TAG="$(shell npm pkg get version)-${ARCH}"
DOCKER_IMAGE_TAG="latest"
DOCKER_IMAGE_WITH_TAG="${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
ECR_IMAGE_REPO="${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${DOCKER_IMAGE_WITH_TAG}"

.PHONY: build publish scan test-local test-remote all

build:
	@echo "building docker image with tag <${DOCKER_IMAGE_TAG}>"
	docker context use default
	docker build -t ${DOCKER_IMAGE_WITH_TAG} --build-arg ARCH=${ARCH} \
		--build-arg AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
		--build-arg AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
		.

publish:
	@echo "ECR REPO ${ECR_IMAGE_REPO}"
	aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com
	docker tag ${DOCKER_IMAGE_WITH_TAG} ${ECR_IMAGE_REPO}
	docker push ${ECR_IMAGE_REPO}
	
scan:
	SCAN_ID=$(shell aws ecr start-image-scan --repository-name ${DOCKER_IMAGE_NAME} --image-id imageTag=${DOCKER_IMAGE_TAG} --region ${REGION} --query 'imageScanStatus.status')
	@echo "SCAN ID ${SCAN_ID}"

test-local:
	@echo "testing build locally..."
	docker run -p 9000:8080 ${DOCKER_IMAGE_NAME}:latest
	curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"test": true, "p": 2.9, "a": 5, "e": 7, "i": 9, "filename": "test.png"}'
	@echo "TEST COMPLETE"

test-remote:
	@echo "testing published build remotely..."
	aws lambda invoke --function-name ${DOCKER_IMAGE_NAME} --cli-binary-format raw-in-base64-out --payload '{"p": 2.9, "a": 5, "e": 7, "i": 9, "filename": "test.png"}' output.txt

all: 
	build publish scan
