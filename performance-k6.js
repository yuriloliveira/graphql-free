import http from 'k6/http';
import { sleep, check } from 'k6';

const GRAPHQL_ENDPOINT = __ENV.GRAPHQL_ENDPOINT;
const GOAL_ID = __ENV.GOAL_ID || "<goal-id>";

export default function () {
  const payload = JSON.stringify({
    query: `{ goal(id: "${GOAL_ID}") { id, title, savedAmount, targetAmount } }`
  });
  const res = http.post(GRAPHQL_ENDPOINT, payload, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  check(res, {
    'is status 200': (r) => r.status === 200,
    'body valid': (r) => (r.body || "").replace(/\s/g, '').includes(`"id":"${GOAL_ID}"`)
  });
  sleep(1);
}
