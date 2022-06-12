# Free GraphQL API
## Prerequisites
- nodejs v14
- yarn
- docker
- docker-compose
- AWS cli
- SAM cli

## Running project locally
### Configure aws cli
Although the project will be run locally, setting up dynamodb requires that the aws cli has been properly configured
```shell
$ aws configure
```
### Setup dynamodb
```shell
$ yarn setup-dynamodb
```
### Running the GraphQL API
```shell
$ yarn start:graphql
```

## Deploying
The deployment via cli uses CloudFormation. This means that, before deploying the API, it's necessary to create a S3 bucket that will hold the CloudFormation stack.
```shell
$ aws s3 mb s3://graphql-free-cf-template
```
The deployment happens in 2 steps: 
1. **package**: Transforms the SAM template file into a CloudFormation template (*template-prod.yaml -> cf-template.yaml*)
2. **deploy**: Uses the CloudFormation file (*cf-template.yaml*) as "blueprint" to create/update the CloudFormation stack.

There's a script that does both steps at once, to make sure all steps are executed:
```shell
$ yarn deploy:graphql
```

## Performance testing
Performance testing will be executed with [k6](https://k6.io/). Please follow the installation instructions from their [k6's docs](https://k6.io/docs/getting-started/installation/).

To run the test, use the following command:

```shell
$ k6 run -e GRAPHQL_ENDPOINT=<api-endpoint> -e GOAL_ID=<goal-id> performance-k6.js --vus 2 --duration 30s
```

It runs the script `performance-k6.js` in endpoint `http://localhost:3000/graphql` with **2 virtuals users** for **30 seconds**.
Feel free to change the parameters for your tests.

*Note: Running the test is recommended to point to an envoriment that's close to production (i.e. use AWS's endpoint instead of localhost).*