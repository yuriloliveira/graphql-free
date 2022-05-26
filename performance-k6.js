import http from 'k6/http';
import { sleep, check } from 'k6';

const GRAPHQL_ENDPOINT = __ENV.GRAPHQL_ENDPOINT;
const goalId = new Date().getTime();
export function setup() {
  const createGoalPayload = JSON.stringify({
    query: `mutation { addGoal(id: "${goalId}", title: "performance-teste-${goalId}") { id } }`
  });
  http.post(GRAPHQL_ENDPOINT, createGoalPayload, {
    headers: {
      "Content-Type": "application/json"
    }
  }).json();
}

export default function () {
  const payload = JSON.stringify({
    query: `{ goal(id: "${goalId}") { id, title, savedAmount, targetAmount } }`
  });
  const res = http.post(GRAPHQL_ENDPOINT, payload, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  check(res, {
    'is status 200': (r) => r.status === 200,
    'body valid': (r) => (r.body || "").replace(/\s/g, '').includes(`"id":"${goalId}"`)
  });
  sleep(1);
}
