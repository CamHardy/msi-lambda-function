# to setup
`aws ecr get-login-password --region ca-central-1 | docker login --username AWS --password-stdin 381492045467.dkr.ecr.ca-central-1.amazonaws.com`

# to build
`docker context use default`
`docker build -t lambda-node-canvas .`
or `docker build -t lambda-node-canvas --build-arg ARCH=arm64 .`

# to upload
`docker tag lambda-node-canvas:latest 381492045467.dkr.ecr.ca-central-1.amazonaws.com/lambda-node-canvas:latest`
`docker push 381492045467.dkr.ecr.ca-central-1.amazonaws.com/lambda-node-canvas:latest`

# to test
## locally
`docker run -p 9000:8080 lambda-node-canvas:latest`
`curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"p": 2.9, "a": 5, "e": 7, "i": 9, "filename": "test.png"}'`

## remotely
`aws lambda invoke --function-name lambda-node-canvas --cli-binary-format raw-in-base64-out --payload '{"type":"line","labels":["2017","2018","2019"],"data":[{"label":"Bears","data":[90,60,120]},{"label":"Dolphins","data":[60,80,100]},{"label":"Whales","data":[70,90,100]}],"title":"Wildlife Population"}' output.txt`
`cat output.txt`

# to fix expired credentials
`docker logout public.ecr.aws`