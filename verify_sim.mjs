import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true, executablePath: '/tmp/pw/chromium-1228/chrome-mac-arm64/Chromium.app/Contents/MacOS/Chromium' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

// 1. Load gaiheki page
await page.goto('http://localhost:3001/gaiheki', { waitUntil: 'networkidle', timeout: 15000 });
await page.screenshot({ path: '/tmp/step0_landing.png', fullPage: false });

// 2. Check simulator section
const simSection = await page.$('#color-simulator');
console.log('✅ #color-simulator section:', !!simSection);

// Scroll to simulator
await page.evaluate(() => document.getElementById('color-simulator')?.scrollIntoView());
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/step1_upload.png' });
console.log('step1 (upload) screenshot taken');

// Check STEP 1 content
const stepHeading = await page.$eval('h3', el => el.textContent).catch(() => null);
console.log('STEP heading:', stepHeading);

// Check camera and file upload labels
const labelTexts = await page.$$eval('label', els => els.map(e => e.textContent?.trim()).filter(Boolean));
console.log('labels found:', labelTexts.filter(t => t.length < 50));

// 3. Simulate file upload (use a local test image)
const fs = await import('fs');
if (fs.existsSync('/tmp/test_house.jpg')) {
  const fileInput = await page.$('input[type="file"]:not([capture])');
  if (fileInput) {
    await fileInput.setInputFiles('/tmp/test_house.jpg');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/step1_after_upload.png' });
    console.log('✅ File uploaded, screenshot taken');
    
    // Check if preview appeared
    const previewImg = await page.$('img[alt="プレビュー"]');
    console.log('✅ Preview image appeared:', !!previewImg);
    
    // Click "この写真でシミュレーションする"
    const nextBtn = await page.getByText('この写真でシミュレーションする').first();
    if (nextBtn) {
      await nextBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: '/tmp/step2_pattern.png' });
      console.log('✅ Step 2 (Pattern) screenshot taken');
      
      // Check pattern options
      const patternBtns = await page.$$eval('button', btns => 
        btns.map(b => b.textContent?.trim()).filter(t => t.includes('外壁') || t.includes('屋根'))
      );
      console.log('Pattern options:', patternBtns.slice(0, 6));
      
      // Select "外壁 ツートン"
      const twoToneBtn = await page.getByText('外壁 ツートン').first();
      if (twoToneBtn) {
        await twoToneBtn.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: '/tmp/step2_twotone.png' });
        console.log('✅ Two-tone selected');
        
        // Check twoTone method options
        const methodBtns = await page.$$eval('button', btns => 
          btns.map(b => b.textContent?.trim()).filter(t => t.includes('階') || t.includes('ベランダ') || t.includes('玄関'))
        );
        console.log('Two-tone methods:', methodBtns.slice(0, 4));
      }
      
      // Go to color step
      const colorBtn = await page.getByText('カラーを選択する').first();
      if (colorBtn) {
        await colorBtn.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: '/tmp/step3_color.png' });
        console.log('✅ Step 3 (Color) screenshot taken');
      }
      
      // Go to mask step
      const maskBtn = await page.getByText('塗装範囲を確認する').first();
      if (maskBtn) {
        await maskBtn.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: '/tmp/step4_mask.png' });
        console.log('✅ Step 4 (Mask) screenshot taken');
        
        // Check auto vs manual toggle
        const autoBtn = await page.getByText('AIに自動判定させる').first();
        const manualBtn = await page.getByText('塗る範囲を修正する').first();
        console.log('✅ Auto mask button:', !!autoBtn);
        console.log('✅ Manual mask button:', !!manualBtn);
        
        // Click manual mask
        if (manualBtn) {
          await manualBtn.click();
          await page.waitForTimeout(500);
          await page.screenshot({ path: '/tmp/step4_manual.png' });
          console.log('✅ Manual mask mode screenshot taken');
        }
      }
    }
  }
}

await browser.close();
console.log('✅ Verification complete');
