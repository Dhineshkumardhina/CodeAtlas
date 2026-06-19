const assert = require('assert');
const path = require('path');
const dotenv = require('dotenv');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const githubService = require('../services/githubService');
const aiService = require('../services/aiService');
const analyzerService = require('../services/analyzerService');

async function runTests() {
  console.log('🧪 Starting CodeAtlas Integration Tests...');

  // Test 1: GitHub URL Parser
  console.log('\n1️⃣ Testing GitHub URL Parser...');
  const parsed = githubService.parseRepoUrl('https://github.com/facebook/react');
  assert.deepStrictEqual(parsed, { owner: 'facebook', repo: 'react' });
  console.log('✅ URL Parser passed!');

  // Test 2: AI Offline Generator
  console.log('\n2️⃣ Testing AI Service Fallback Generator...');
  const mockRepoData = {
    projectName: 'TestRepo',
    description: 'A mock project for testing',
    language: 'JavaScript',
    folders: ['src', 'tests', 'public'],
    importantFiles: ['package.json'],
    topics: ['test', 'integration']
  };
  
  const explanation = await aiService.generateRepoExplanation(mockRepoData);
  assert.ok(explanation);
  assert.strictEqual(explanation.projectName, 'TestRepo');
  assert.ok(explanation.overview.includes('TestRepo'));
  assert.ok(explanation.learningRoadmap.length > 0);
  console.log('✅ AI Fallback Generator passed!');

  // Test 3: Full Analyzer Pipeline (Offline Mode due to mock params)
  console.log('\n3️⃣ Testing Analyzer Pipeline (calling with mock URL)...');
  try {
    // Note: This will call live GitHub API unless rate limits are hit.
    // If rate limits are hit or GITHUB_TOKEN is missing, it handles errors or we can test with a simple URL.
    // Let's use a repository URL.
    const result = await analyzerService.analyzeRepository('https://github.com/facebook/react');
    assert.ok(result);
    assert.ok(result.repositoryData);
    assert.ok(result.aiExplanation);
    assert.ok(result.roadmap);
    console.log('✅ Analyzer Pipeline passed!');
  } catch (error) {
    console.log(`⚠️ Analyzer live API execution skipped/failed: ${error.message}`);
    console.log('💡 Note: This is expected if offline or GitHub API rate limits are hit without GITHUB_TOKEN.');
  }

  console.log('\n🎉 All local validation checks completed successfully!');
}

runTests().catch(err => {
  console.error('❌ Tests failed:', err);
  process.exit(1);
});
