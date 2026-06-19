const githubService = require('./githubService');
const aiService = require('./aiService');

/**
 * Orchestrates the full repository analysis
 * @param {string} repoUrl - The URL of the GitHub repository
 * @returns {Promise<Object>} - Contains repositoryData, aiExplanation, and roadmap issues
 */
const analyzeRepository = async (repoUrl) => {
  // 1. Parse repository URL
  const repoMeta = githubService.parseRepoUrl(repoUrl);
  if (!repoMeta) {
    throw new Error('Invalid GitHub URL format. Use formats like: https://github.com/owner/repo');
  }

  const { owner, repo } = repoMeta;

  // 2. Fetch repository information from GitHub
  console.log(`🔍 Fetching metadata for ${owner}/${repo}...`);
  const repoInfo = await githubService.getRepoInfo(owner, repo);
  
  // 3. Fetch directory contents
  console.log(`📁 Fetching file tree for ${owner}/${repo}...`);
  const contents = await githubService.getRepoContents(owner, repo);
  
  // Distinguish folders and important files
  const folders = [];
  const importantFiles = [];
  const specialFiles = ['package.json', 'tsconfig.json', 'requirements.txt', 'gemfile', 'cargo.toml', 'go.mod', 'docker-compose.yml', 'server.js', 'app.js', 'index.js', 'readme.md'];

  contents.forEach(item => {
    if (item.type === 'dir') {
      // Exclude hidden folders (e.g. .github, .git) from general listing for beginners
      if (!item.name.startsWith('.')) {
        folders.push(item.name);
      }
    } else if (item.type === 'file') {
      const lowerName = item.name.toLowerCase();
      if (specialFiles.includes(lowerName) || lowerName.endsWith('.env') || lowerName.endsWith('.config.js') || lowerName.endsWith('.config.ts')) {
        importantFiles.push(item.path);
      }
    }
  });

  // 4. Fetch README content
  console.log(`📄 Fetching README for ${owner}/${repo}...`);
  const readme = await githubService.getReadmeContent(owner, repo);

  // Consolidated repository metadata package
  const repositoryData = {
    projectName: repoInfo.name,
    description: repoInfo.description || '',
    language: repoInfo.language || 'Unknown',
    stars: repoInfo.stargazers_count || 0,
    forks: repoInfo.forks_count || 0,
    technologies: repoInfo.topics || [],
    folders: folders,
    importantFiles: importantFiles,
    readme: readme
  };

  // 5. Fetch open issues
  console.log(`🐛 Fetching open issues for ${owner}/${repo}...`);
  const rawIssues = await githubService.getBeginnerFriendlyIssues(owner, repo);

  // 6. Generate AI Explanations
  console.log(`🤖 Generating AI explanation for ${owner}/${repo}...`);
  const aiExplanation = await aiService.generateRepoExplanation(repositoryData);

  // Remove readme from returned data payload to save bandwidth
  delete repositoryData.readme;

  // 7. Assemble Contribution Roadmap
  // Map issues and match them with suggestions based on repository technologies and file layout
  const roadmap = rawIssues.map(issue => {
    // Generate suggested skills based on repository language and topics
    const skills = [repositoryData.language];
    if (repositoryData.technologies && repositoryData.technologies.length > 0) {
      skills.push(...repositoryData.technologies.slice(0, 2));
    }

    // Guess suggested files for this issue based on its titles/labels
    const suggestedFiles = [];
    const lowerTitle = issue.title.toLowerCase();

    if (lowerTitle.includes('readme') || lowerTitle.includes('docs') || lowerTitle.includes('documentation')) {
      suggestedFiles.push('README.md');
    } else if (lowerTitle.includes('style') || lowerTitle.includes('css') || lowerTitle.includes('ui') || lowerTitle.includes('button')) {
      // Find frontend looking files or index css
      const styleFile = importantFiles.find(f => f.includes('css') || f.includes('tailwind')) || 'src/index.css';
      suggestedFiles.push(styleFile);
    } else {
      // General entry point suggest
      if (importantFiles.length > 0) {
        suggestedFiles.push(importantFiles[0]);
      }
    }

    return {
      title: issue.title,
      url: issue.url,
      difficulty: issue.difficulty,
      skills: [...new Set(skills)], // Unique list
      files: suggestedFiles,
      labels: issue.labels
    };
  });

  return {
    repositoryData,
    aiExplanation,
    roadmap
  };
};

module.exports = {
  analyzeRepository
};
