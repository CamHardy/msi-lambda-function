# msi-lambda-function

You will need:
- Docker
- AWS CLI

Before running make:
`cp .env.example .env`

Fill in the .env file with your AWS info, then:
`source .env`

## to build
`make build`

## to upload to AWS
`make publish`

## to fix expired credentials
`docker logout public.ecr.aws`

## to test

### locally
`make test-local`

### remotely
`make test-remote`
`cat output.txt`