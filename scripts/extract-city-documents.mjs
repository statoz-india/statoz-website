import { readFile, writeFile } from 'node:fs/promises';

const output = 'src/features/home/city-documents.tsx';
const documents = [['about', 'AboutContent'], ['termsAndConditions', 'TermsContent'], ['privacyPolicy', 'PrivacyContent']];
const components = [];
for (const [route, name] of documents) {
  const file = 'src/app/' + route + '/page.tsx';
  const source = await readFile(file, 'utf8');
  if (source.includes('<' + name + ' />')) throw new Error('Documents have already been extracted.');
  const marker = '<div className="legal-body">';
  const start = source.indexOf(marker) + marker.length;
  const end = source.indexOf('</div>\n        </div>\n      </article>', start);
  const crlfEnd = source.indexOf('</div>\r\n        </div>\r\n      </article>', start);
  const finish = end < 0 ? crlfEnd : end;
  if (start < marker.length || finish < 0) throw new Error('Document boundary not found: ' + route);
  components.push('export function ' + name + '() { return <>' + source.slice(start, finish) + '</>; }');
  await writeFile(file, 'import { ' + name + ' } from "@/features/home/city-documents";\n' + source.slice(0, start) + '\n            <' + name + ' />\n          ' + source.slice(finish));
}
await writeFile(output, '// Shared original company and legal copy. Rendered by both canonical pages and city panels.\n' + components.join('\n\n') + '\n');
console.log('Extracted three documents without changing their content.');
