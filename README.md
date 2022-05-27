# Free GraphQL API
## Performance testing
Performance testing will be executed with [k6](https://k6.io/). Please follow the installation instructions from their [k6's docs](https://k6.io/docs/getting-started/installation/).

To run the test, use the following command:

```shell
$ k6 run -e GRAPHQL_ENDPOINT=http://localhost:3000/graphql performance-k6.js --vus 2 --duration 30s
```

It runs the script `performance-k6.js` in endpoint `http://localhost:3000/graphql` with **2 virtuals users** for **30 seconds**.
Feel free to change the parameters for your tests.

*Note: Running the test is recommended to point to an envoriment that's close to production (i.e. use AWS's endpoint instead of localhost).*