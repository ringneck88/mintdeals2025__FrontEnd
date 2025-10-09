// dutchie-to-es.mjs  (Node 18+)
// Usage:
//   $env:DUTCHIE_API_KEY="b0d5458684d24f48bb4c927be754a855"   # PowerShell
//   node dutchie-to-es.mjs
//
// Optional env:
//   ES_ENDPOINT=https://elasticsearch-production-486b.up.railway.app
//   ES_INDEX=dutchie_discounts
//   ES_BASIC_AUTH="user:pass"  (or) ES_BEARER="eyJ..."  for Elasticsearch only
//   BULK_BATCH_SIZE=1000
//   CREATE_INDEX_IF_MISSING=true

const ES_ENDPOINT = process.env.ES_ENDPOINT || 'https://elasticsearch-production-486b.up.railway.app';
const ES_INDEX = process.env.ES_INDEX || 'dutchie_discounts';
const DUTCHIE_API_KEY = process.env.DUTCHIE_API_KEY; // REQUIRED
const BULK_BATCH_SIZE = Number(process.env.BULK_BATCH_SIZE || 1000);
const CREATE_INDEX_IF_MISSING = String(process.env.CREATE_INDEX_IF_MISSING || 'true').toLowerCase() === 'true';

const ES_BASIC_AUTH = process.env.ES_BASIC_AUTH; // for Elasticsearch (optional)
const ES_BEARER = process.env.ES_BEARER;         // for Elasticsearch (optional)

if (!DUTCHIE_API_KEY) {
  console.error('DUTCHIE_API_KEY is required (set it in your environment).');
  process.exit(1);
}

// --- Dutchie auth: Basic <base64("API_KEY:")> ---
const basicDutchie = Buffer.from(`${DUTCHIE_API_KEY}:`, 'utf8').toString('base64');
const DUTCHIE_HEADERS = {
  'Authorization': `Basic ${basicDutchie}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

// Discounts endpoint
const DUTCHIE_URL = 'https://api.pos.dutchie.com/discounts/v2/list?includeInactive=false&includeInclusionExclusion=null';

// --- Helpers for Elasticsearch auth/headers ---
function authInit(init = {}) {
  const headers = new Headers(init.headers || {});
  if (ES_BASIC_AUTH) {
    headers.set('Authorization', `Basic ${Buffer.from(ES_BASIC_AUTH, 'utf8').toString('base64')}`);
  } else if (ES_BEARER) {
    headers.set('Authorization', `Bearer ${ES_BEARER}`);
  }
  return { ...init, headers };
}
function esJsonHeaders() { return new Headers({ 'Content-Type': 'application/json' }); }
function esBulkHeaders() { return new Headers({ 'Content-Type': 'application/x-ndjson' }); }

function pickId(o) {
  for (const k of ['id','_id','uuid','guid','code']) {
    const v = o?.[k];
    if (typeof v === 'string' || typeof v === 'number') return String(v);
  }
  return null;
}
function toNdjsonLines(docs, indexName) {
  const lines = [];
  for (const d of docs) {
    const _id = pickId(d);
    lines.push(JSON.stringify(_id ? { index: { _index: indexName, _id } }
                                 : { index: { _index: indexName } }));
    lines.push(JSON.stringify(d));
  }
  return lines;
}
function chunk(arr, n) { const out=[]; for (let i=0;i<arr.length;i+=n) out.push(arr.slice(i,i+n)); return out; }

async function ensureIndexExists() {
  if (!CREATE_INDEX_IF_MISSING) return;
  const exists = await fetch(`${ES_ENDPOINT}/${encodeURIComponent(ES_INDEX)}`, authInit());
  if (exists.ok) return;

  const body = {
    settings: { number_of_shards: 1, number_of_replicas: 1 },
    mappings: {
      dynamic: true,
      properties: {
        name: { type: 'text' },
        code: { type: 'keyword' },
        active: { type: 'boolean' },
        startsAt: { type: 'date', ignore_malformed: true },
        endsAt:   { type: 'date', ignore_malformed: true },
        createdAt:{ type: 'date', ignore_malformed: true },
        updatedAt:{ type: 'date', ignore_malformed: true }
      }
    }
  };
  const res = await fetch(`${ES_ENDPOINT}/${encodeURIComponent(ES_INDEX)}`,
    authInit({ method: 'PUT', headers: esJsonHeaders(), body: JSON.stringify(body) }));
  if (!res.ok) throw new Error(`Failed to create index: ${res.status} ${await res.text()}`);
}

function normalizeArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.results)) return payload.results;
    if (Array.isArray(payload.items)) return payload.items;
  }
  return [payload];
}

async function dutchieGET(url) {
  const res = await fetch(url, { headers: DUTCHIE_HEADERS });
  if (!res.ok) throw new Error(`Dutchie request failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function fetchAllDiscounts() {
  // If pagination exists, add loop here (cursor/page); for now assume single page
  const first = await dutchieGET(DUTCHIE_URL);
  return normalizeArray(first);
}

async function bulkIndex(docs) {
  if (docs.length === 0) return;
  const batches = chunk(docs, BULK_BATCH_SIZE);
  console.log(`Indexing ${docs.length} docs in ${batches.length} batch(es)…`);
  for (let i = 0; i < batches.length; i++) {
    const nd = toNdjsonLines(batches[i], ES_INDEX).join('\n') + '\n';
    const res = await fetch(`${ES_ENDPOINT}/_bulk`, authInit({ method: 'POST', headers: esBulkHeaders(), body: nd }));
    if (!res.ok) throw new Error(`_bulk failed (${i+1}/${batches.length}): ${res.status} ${await res.text()}`);
    const json = await res.json();
    if (json.errors) {
      const firstErr = (json.items||[]).find(it => (it.index||it.create||it.update||it.delete)?.error);
      console.error('Bulk had errors. First error item:', JSON.stringify(firstErr, null, 2));
      throw new Error('Elasticsearch bulk reported errors');
    }
    console.log(`Batch ${i+1}/${batches.length}: OK`);
  }
}

async function sampleSearch() {
  const res = await fetch(`${ES_ENDPOINT}/${encodeURIComponent(ES_INDEX)}/_search?size=1&pretty`, authInit());
  console.log('Sample search:\n', await res.text());
}

(async () => {
  try {
    // Quick auth sanity check with /whoami
    const who = await fetch('https://api.pos.dutchie.com/whoami', { headers: DUTCHIE_HEADERS });
    if (!who.ok) throw new Error(`Dutchie auth check failed: ${who.status} ${await who.text()}`);
    console.log('Dutchie /whoami OK');

    console.log('→ Ensuring index exists…');
    await ensureIndexExists();

    console.log('→ Fetching Dutchie discounts…');
    const docs = await fetchAllDiscounts();
    console.log(`Fetched ${docs.length} record(s).`);

    console.log('→ Bulk indexing…');
    await bulkIndex(docs);

    console.log('→ Done.');
    await sampleSearch();
  } catch (e) {
    console.error('ERROR:', e.message || e);
    process.exit(1);
  }
})();
