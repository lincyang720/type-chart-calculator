// 检查 combo 页面是否正确生成
const fs = require('fs');
const path = require('path');

const comboDir = path.join(__dirname, '.next/server/app/combo');

console.log('🔍 检查 combo 页面生成情况...\n');

// 检查几个问题页面
const testPages = ['fire-flying', 'water-ground', 'steel-fairy'];

testPages.forEach(combo => {
  const htmlPath = path.join(comboDir, `[combo]/${combo}.html`);
  const rsxPath = path.join(comboDir, `[combo]/${combo}.rsc`);
  
  console.log(`📄 ${combo}:`);
  
  if (fs.existsSync(htmlPath)) {
    const size = fs.statSync(htmlPath).size;
    console.log(`  ✅ HTML 存在 (${(size/1024).toFixed(1)}KB)`);
  } else {
    console.log(`  ⚠️  HTML 不存在`);
  }
  
  if (fs.existsSync(rsxPath)) {
    const size = fs.statSync(rsxPath).size;
    console.log(`  ✅ RSC 存在 (${(size/1024).toFixed(1)}KB)`);
  } else {
    console.log(`  ⚠️  RSC 不存在`);
  }
  
  console.log('');
});

// 检查 generateStaticParams 是否正确
console.log('📋 检查 generateStaticParams...');
const comboPagePath = path.join(__dirname, 'app/combo/[combo]/page.tsx');
if (fs.existsSync(comboPagePath)) {
  const content = fs.readFileSync(comboPagePath, 'utf-8');
  if (content.includes('generateStaticParams')) {
    console.log('  ✅ generateStaticParams 已定义');
  } else {
    console.log('  ❌ generateStaticParams 未定义');
  }
}

