import {chromium} from '@playwright/test';
import lighthouse from 'lighthouse';
import {writeFile} from 'node:fs/promises';
import {createServer} from 'node:net';
// Pick an available local debugging port and let Playwright own browser cleanup.
const probe=createServer();
await new Promise((resolve,reject)=>{probe.once('error',reject);probe.listen(0,'127.0.0.1',resolve);});
const port=probe.address().port;
await new Promise(resolve=>probe.close(resolve));
const browser=await chromium.launch({args:[`--remote-debugging-port=${port}`]});
try{
 const result=await lighthouse('http://127.0.0.1:4410/',{port,output:'json',onlyCategories:['performance','accessibility','best-practices','seo']});
 await writeFile('docs/qa/lighthouse.json',result.report);
 console.log(JSON.stringify({scores:Object.fromEntries(Object.entries(result.lhr.categories).map(([k,v])=>[k,v.score])),LCP:result.lhr.audits['largest-contentful-paint'].numericValue,CLS:result.lhr.audits['cumulative-layout-shift'].numericValue},null,2));
}finally{await browser.close();}
