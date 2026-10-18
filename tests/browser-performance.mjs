// Run with Playwright installed, or set PLAYWRIGHT_MODULE to its ESM entry point.
import path from "node:path";
import assert from "node:assert/strict";

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||"playwright");
const root=new URL("../",import.meta.url).pathname;
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||"chrome",headless:true});
const errors=[];
try{
  for(const planet of ["earth","mars","venus"]){
    const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    const page=await context.newPage();page.on("pageerror",error=>errors.push(error.message));
    await page.route("**/*",route=>{const name=new URL(route.request().url()).pathname.split("/").at(-1)||"index.html";return["index.html","app.js","i18n.js","styles.css","icon.svg","manifest.webmanifest"].includes(name)?route.fulfill({path:path.join(root,name)}):route.abort();});
    await page.goto("http://fabrique-regression.test/");await page.waitForFunction(()=>initialized);
    await page.evaluate(planet=>{
      initialized=false;configurePlanet(planet);state=initialState(planet);state.sound=false;state.cycles=3;state.dawns=8;state.drops=1e30;state.runTotal=1e30;state.currentPath="engineer";units.forEach(unit=>state.owned[unit.id]=10);state.nextEventAt=now()+1e9;state.nextContractAt=now()+1e9;applyPlanetTheme();applySettings();render(true);initialized=true;
    },planet);
    for(const language of ["en","fr","en"]){
      await page.evaluate(language=>setLanguage(language),language);
      const labels=await page.evaluate(()=>({title:document.title,cloud:els.cloud.getAttribute('aria-label')}));
      assert.ok(labels.cloud.startsWith(language==='en'?'Press the ':'Presser le '),planet+' cloud accessibility locale');
      assert.ok(labels.title.includes(language==='en'?(planet==='earth'?'Cloudworks':planet==='mars'?'Red Colony':'Twilight Cities'):(planet==='earth'?'Fabrique':planet==='mars'?'Colonie':'Cités')),planet+' document title locale');
      for(const tab of ["automates","upgrades","strategy","records"]){
        await page.locator('[data-tab="'+tab+'"]').click();
        assert.equal(await page.locator("#"+tab+"Page").isVisible(),true,planet+" "+tab);
        if(tab==="automates"){
          const copy=await page.locator(".unit-info>small").first().innerText();assert.ok(copy.includes(language==="en"?"each":"chacun"),planet+" machine locale "+language);
        }
        if(tab==="upgrades")assert.ok(await page.locator(".upgrade-card").count()>0,planet+" upgrades must render on opening");
        if(tab==="strategy")assert.equal(await page.locator(".path-tech").count(),8);
        if(tab==="records")assert.equal(await page.locator(".record-card").count(),9);
      }
      await page.locator('#dawnTreeButton').click();assert.equal(await page.locator("#dawnDialog").isVisible(),true);assert.equal(await page.locator(".dawn-node").count(),11);
      await page.locator('[data-close="dawnDialog"]').click();
    }
    await page.locator('[data-tab="automates"]').click();
    const stable=await page.evaluate(()=>{
      const card=document.querySelector('[data-unit="'+units[0].id+'"]');card.focus();const old=state.owned[units[0].id];buyUnit(units[0].id);render(true);
      const retained=card===document.querySelector('[data-unit="'+units[0].id+'"]'),focused=document.activeElement===card;
      return{retained,focused,increased:state.owned[units[0].id]===old+1};
    });assert.deepEqual(stable,{retained:true,focused:true,increased:true},planet+" purchase must preserve its card and focus");
    await page.locator('[data-mode="max"]').click();
    await page.evaluate(()=>{state.settings.effects=false;applySettings();pressCloud({clientX:100,clientY:100});burst({clientX:100,clientY:100});});
    assert.equal(await page.locator(".float-number,.purchase-burst").count(),0,planet+" reduced effects must avoid JS particles");
    await page.evaluate(()=>{save();initialized=false;});
    await page.reload();await page.waitForFunction(()=>initialized);
    const restored=await page.evaluate(()=>({planet:state.planet,mode:state.buyMode,language:state.settings.language,overflow:document.documentElement.scrollWidth>innerWidth}));
    assert.deepEqual(restored,{planet,mode:"max",language:"en",overflow:false},planet+" save reload and mobile layout");
    if(process.env.AUDIT_SCREENSHOT_DIR&&planet==='venus'){
      await page.screenshot({path:path.join(process.env.AUDIT_SCREENSHOT_DIR,'venus-mobile-en.png')});
      await page.setViewportSize({width:1365,height:900});
      await page.screenshot({path:path.join(process.env.AUDIT_SCREENSHOT_DIR,'venus-desktop-en.png')});
    }
    await context.close();console.log("✓ Browser interactions, retained cards, locales and save reload: "+planet);
  }
  assert.deepEqual(errors,[],"No browser errors");
}finally{await browser.close();}
