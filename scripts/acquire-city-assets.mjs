import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import path from 'node:path';

// Public, free CC0 packs only. Signed download URLs stay in memory.
const directory = path.resolve('.cache/city-assets');
await mkdir(directory, { recursive: true });
for (const slug of ['city-kit-commercial', 'city-kit-roads', 'racing-kit']) {
  const file = path.join(directory, slug + '.zip');
  try { await access(file); console.log(slug + ': cached'); continue; } catch {}
  const source = 'https://kenney.nl/assets/' + slug;
  const page = await fetch(source, { signal: AbortSignal.timeout(30000) });
  await page.text();
  const cookie = page.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
  const id = Buffer.from('assets/' + slug).toString('hex');
  const response = await fetch('https://kenney.nl/download-link/' + id, { headers: { Referer: source, Origin: 'https://kenney.nl', Cookie: cookie, 'X-Requested-With': 'XMLHttpRequest' }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(slug + ': download metadata HTTP ' + response.status);
  const metadata = await response.json();
  const url = metadata.url || metadata.download || metadata.link;
  if (!url) throw new Error(slug + ': missing download URL (' + Object.keys(metadata).join(', ') + ')');
  const archive = await fetch(url, { signal: AbortSignal.timeout(90000) });
  if (!archive.ok) throw new Error(slug + ': archive HTTP ' + archive.status);
  const bytes = Buffer.from(await archive.arrayBuffer());
  await writeFile(file, bytes);
  console.log(slug + ': ' + bytes.length + ' bytes');
}

const quaterniusFile = path.join(directory, 'downtown-city-megakit.zip');
let cached = false;
try { await access(quaterniusFile); cached = true; } catch {}
if (!cached) {
  const source = 'https://quaternius.itch.io/downtown-city-megakit';
  const page = await fetch(source, { signal: AbortSignal.timeout(30000) });
  const html = await page.text();
  const csrf = html.match(/name="csrf_token" value="([^"]+)"/)?.[1];
  if (!csrf) throw new Error('Missing public download CSRF token');
  let cookie = page.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded', Referer: source, Origin: 'https://quaternius.itch.io', Cookie: cookie, 'X-Requested-With': 'XMLHttpRequest' };
  const landing = await fetch(source + '/download_url', { method: 'POST', headers, body: new URLSearchParams({ csrf_token: csrf }), signal: AbortSignal.timeout(30000) });
  const metadata = await landing.json();
  if (!metadata.url) throw new Error('No free Quaternius download page returned');
  const downloads = await fetch(metadata.url, { headers: { Cookie: cookie }, signal: AbortSignal.timeout(30000) });
  const downloadHtml = await downloads.text();
  const upload = downloadHtml.match(/data-upload_id="(\d+)"/)?.[1];
  const downloadCsrf = downloadHtml.match(/name="csrf_token" value="([^"]+)"/)?.[1] || csrf;
  cookie += '; ' + downloads.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
  if (!upload) throw new Error('No free Quaternius archive found');
  const fileResponse = await fetch(source + '/file/' + upload, { method: 'POST', headers: { ...headers, Cookie: cookie, Referer: metadata.url }, body: new URLSearchParams({ csrf_token: downloadCsrf }), signal: AbortSignal.timeout(30000) });
  const fileMetadata = await fileResponse.json();
  if (!fileMetadata.url) throw new Error('Quaternius file response: ' + fileResponse.status);
  console.log('Downloading the free Quaternius Standard archive...');
  const archive = await fetch(fileMetadata.url, { signal: AbortSignal.timeout(180000) });
  if (!archive.ok) throw new Error('Quaternius archive HTTP ' + archive.status);
  const bytes = Buffer.from(await archive.arrayBuffer());
  await writeFile(quaterniusFile, bytes);
  console.log('Quaternius Standard: ' + bytes.length + ' bytes');
}

try { await access(path.join(directory, 'libktx.zip')); } catch {
  const encoder = await fetch('https://github.com/KhronosGroup/KTX-Software/releases/download/v4.4.2/KTX-Software-4.4.2-Web-libktx.zip', { signal: AbortSignal.timeout(60000) });
  if (!encoder.ok) throw new Error('Khronos encoder HTTP ' + encoder.status);
  await writeFile(path.join(directory, 'libktx.zip'), Buffer.from(await encoder.arrayBuffer()));
  console.log('Portable Khronos texture encoder downloaded.');
}
