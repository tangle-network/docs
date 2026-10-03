import { sandboxCode } from "./sandbox-code";

const existingSandbox = `import { Sandbox } from '@tangle-network/sandbox';

const apiKey = process.env.TANGLE_API_KEY;
const sandboxId = process.env.TANGLE_SANDBOX_ID;
if (!apiKey || !sandboxId) {
  throw new Error('Set TANGLE_API_KEY and TANGLE_SANDBOX_ID');
}

const tangle = new Sandbox({ apiKey, baseUrl: 'https://sandbox.tangle.tools' });
const box = await tangle.get(sandboxId);
if (!box) throw new Error('Sandbox not found');`;

export const networkingExamples = {
  preview: sandboxCode.preview,
  pythonPreview: sandboxCode.pythonPreview,
  createPolicy: sandboxCode.network,
  pythonCreatePolicy: sandboxCode.pythonNetwork,
  updatePolicy: `${existingSandbox}

console.log(await box.egress.get());
await box.egress.update({
  mode: 'strict',
  allowDomains: ['docs.tangle.tools', 'api.github.com'],
  includeImplicitDomains: false,
});
console.log(await box.egress.get());`,
  pythonUpdatePolicy: `import os
import httpx

sandbox_id = os.environ['TANGLE_SANDBOX_ID']
with httpx.Client(
    base_url='https://sandbox.tangle.tools', timeout=180,
    headers={'Authorization': f"Bearer {os.environ['TANGLE_API_KEY']}"},
) as tangle:
    path = f'/v1/sandboxes/{sandbox_id}'
    box = tangle.get(path).raise_for_status().json()
    print(box.get('egressPolicy'), box.get('egressPolicySource'))
    result = tangle.patch(f'{path}/egress', json={
        'mode': 'strict',
        'allowDomains': ['docs.tangle.tools', 'api.github.com'],
        'includeImplicitDomains': False,
    }).raise_for_status().json()
    print(result['egressPolicy'], result['source'])`,
  activity: `${existingSandbox}

console.table(await box.egress.denials({ limit: 20 }));
const activity = await box.egress.activity({ limit: 20 });
console.table(activity.destinations);
console.log({
  requestsObserved: activity.requestsObserved,
  complete: activity.complete,
  incompleteReasons: activity.incompleteReasons,
});`,
  pythonActivity: `import os
import httpx

sandbox_id = os.environ['TANGLE_SANDBOX_ID']
with httpx.Client(
    base_url='https://sandbox.tangle.tools', timeout=30,
    headers={'Authorization': f"Bearer {os.environ['TANGLE_API_KEY']}"},
) as tangle:
    path = f'/v1/sandboxes/{sandbox_id}/egress'
    denials = tangle.get(f'{path}/denials', params={'limit': 20})
    print(denials.raise_for_status().json()['denials'])
    response = tangle.get(f'{path}/activity', params={'limit': 20})
    activity = response.raise_for_status().json()['activity']
    for destination in activity['destinations']:
        print(destination['host'], destination['action'], destination['count'])
    print('Complete:', activity['complete'])
    print('Missing:', activity['incompleteReasons'])`,
  ssh: `import { execSync } from 'node:child_process';
${existingSandbox}

const ssh = await box.sshCommand();
execSync(ssh.command, {
  stdio: 'inherit',
  env: { ...process.env, ...ssh.env },
});`,
  installCli: "npm install -g @tangle-network/sandbox-cli",
} as const;
