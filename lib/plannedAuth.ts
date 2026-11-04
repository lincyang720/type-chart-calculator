import { SEARCH_ENDPOINT } from './agentReady';

const BODY = {
  status: 'under_construction',
  available: false,
  capabilities_status: 'planned_contract_only',
  message: 'Coming soon; authentication is not available.',
  launch_date: null,
  error: 'temporarily_unavailable',
  error_description:
    'Coming soon. No registration, authorization, token issuance, claim, or revocation operation is available. Use the public read-only lookup service.',
  public_service: SEARCH_ENDPOINT,
};

export function plannedAuthUnavailable(): Response {
  return new Response(JSON.stringify(BODY, null, 2), {
    status: 503,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
      'retry-after': '86400',
    },
  });
}
