import { defineConfig } from '@playwright/test';
const port = Number(process.env.CITY_TEST_PORT || 4410);
const baseURL = 'http://127.0.0.1:' + port;
export default defineConfig({
 testDir:'./tests',timeout:120000,fullyParallel:false,workers:1,
 use:{baseURL,browserName:'chromium',headless:true,launchOptions:{channel:'chromium'}},
 reporter:[['list'],['json',{outputFile:'docs/qa/browser-results.json'}]],
 webServer:{command:'npm run start -- --port ' + port,url:baseURL,reuseExistingServer:true,timeout:60000},
});
