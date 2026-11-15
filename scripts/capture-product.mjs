import {chromium} from '@playwright/test';
import {writeFile,mkdir} from 'node:fs/promises';
import sharp from 'sharp';
await mkdir('docs/qa',{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1200,height:900},deviceScaleFactor:1});
const results=[];
for(const [name,url] of [['sports','https://pai45.github.io/statoz-next-sports-web/'],['games','https://pai45.github.io/statoz-next-games-web/']]){
 try{const response=await page.goto(url,{waitUntil:'networkidle',timeout:60000});await page.waitForTimeout(1500);await page.screenshot({path:'docs/qa/'+name+'-source.png'});await sharp('docs/qa/'+name+'-source.png').webp({quality:88}).toFile('public/assets/stadium/'+name+'-preview.webp');results.push({name,url,status:response?.status(),title:await page.title(),capturedAt:new Date().toISOString()});}catch(error){results.push({name,url,error:error.message});}
}
for(const slug of ['hoop-legacy','pitch-rush','cricketer','portfolio-formula','longbow','open-golf']){
 const url='https://pai45.github.io/statoz-next-games-web/play/'+slug+'/';
 try{const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});results.push({name:slug,url,status:response?.status(),title:await page.title()});}catch(error){results.push({name:slug,url,error:error.message});}
}
for(const url of ['https://pai45.github.io/statoz-next-sports-web/quiz/','https://play.google.com/store/apps/details?id=com.statoz.app','https://apps.apple.com/in/app/statoz/id6761310455']){
 try{const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});results.push({url,status:response?.status(),title:await page.title()});}catch(error){results.push({url,error:error.message});}
}
await browser.close();await writeFile('docs/qa/destinations.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
