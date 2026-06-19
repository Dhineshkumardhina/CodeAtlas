const axios = require('axios');

/**
 * Helper to construct GitHub API headers
 */
const getHeaders = () => {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) {
    headers.Authorization = `token ${token}`;
  }
  return headers;
};

/**
 * Extracts owner and repo name from various GitHub URL formats
 * Examples:
 * https://github.com/owner/repo
 * https://github.com/owner/repo.git
 * http://github.com/owner/repo/tree/main
 */
const parseRepoUrl = (repoUrl) => {
  if (!repoUrl) return null;
  const cleanUrl = repoUrl.trim().replace(/\.git$/, '').replace(/\/$/, '');
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/i;
  const match = cleanUrl.match(regex);
  if (match && match[1] && match[2]) {
    // If url contains branches or subpages like /tree/main, extract just owner and repo name
    const owner = match[1];
    const repo = match[2].split('/')[0];
    return { owner, repo };
  }
  return null;
};

/**
 * Fetches repository metadata
 */
const getRepoInfo = async (owner, repo) => {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    const response = await axios.get(url, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error(`GitHub API error in getRepoInfo for ${owner}/${repo}:`, error.message);
    throw new Error(error.response?.data?.message || 'Repository not found on GitHub');
  }
};

/**
 * Fetches top-level directory contents
 */
const getRepoContents = async (owner, repo) => {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents`;
    const response = await axios.get(url, { headers: getHeaders() });
    return response.data; // Array of file/dir objects
  } catch (error) {
    console.error(`GitHub API error in getRepoContents for ${owner}/${repo}:`, error.message);
    return []; // Return empty list on failure rather than failing the whole flow
  }
};

/**
 * Fetches README content and decodes it
 */
const getReadmeContent = async (owner, repo) => {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/readme`;
    const response = await axios.get(url, { headers: getHeaders() });
    if (response.data && response.data.content) {
      // Content is base64 encoded
      const buffer = Buffer.from(response.data.content, 'base64');
      return buffer.toString('utf8');
    }
    return '';
  } catch (error) {
    console.error(`GitHub API error in getReadmeContent for ${owner}/${repo}:`, error.message);
    return '';
  }
};

/**
 * Fetches open issues and filters/marks beginner ones
 */
const getBeginnerFriendlyIssues = async (owner, repo) => {
  try {
    // Fetch top 30 open issues
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=50`;
    const response = await axios.get(url, { headers: getHeaders() });
    
    const beginnerLabels = ['good first issue', 'good-first-issue', 'beginner', 'first-timers-only', 'documentation', 'help wanted', 'easy', 'starter'];
    
    // Map and filter issues
    const issues = response.data
      // Filter out pull requests (GitHub API returns pull requests in the issues endpoint)
      .filter(issue => !issue.pull_request)
      .map(issue => {
        const labels = issue.labels.map(l => l.name.toLowerCase());
        const isBeginnerFriendly = labels.some(label => 
          beginnerLabels.some(bLabel => label.includes(bLabel))
        );
        
        // Assess difficulty based on labels
        let difficulty = 'beginner';
        if (labels.some(l => l.includes('intermediate') || l.includes('medium'))) {
          difficulty = 'intermediate';
        } else if (labels.some(l => l.includes('advanced') || l.includes('hard'))) {
          difficulty = 'advanced';
        }
        
        return {
          title: issue.title,
          url: issue.html_url,
          labels: issue.labels.map(l => l.name),
          isBeginnerFriendly,
          difficulty
        };
      });

    // Return beginner friendly ones first, limited to 10
    const friendlyIssues = issues.filter(i => i.isBeginnerFriendly);
    if (friendlyIssues.length > 0) {
      return friendlyIssues.slice(0, 10);
    }
    // If no issues have explicitly friendly labels, return some general issues marked as beginner/intermediate
    return issues.slice(0, 8);
  } catch (error) {
    console.error(`GitHub API error in getBeginnerFriendlyIssues for ${owner}/${repo}:`, error.message);
    return [];
  }
};

module.exports = {
  parseRepoUrl,
  getRepoInfo,
  getRepoContents,
  getReadmeContent,
  getBeginnerFriendlyIssues
};
