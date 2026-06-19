const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Generates an AI-powered repository analysis
 * @param {Object} repoData - Repository data fetched from GitHub
 * @returns {Promise<Object>} - AI summary, architecture description, and roadmap recommendations
 */
const generateRepoExplanation = async (repoData) => {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ AI_API_KEY not found in environment variables. Using smart fallback generator.');
    return generateFallbackExplanation(repoData);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const readmeSnippet = repoData.readme ? repoData.readme.slice(0, 1500) : 'No README available.';
    const foldersList = repoData.folders.join(', ') || 'None';
    const filesList = repoData.importantFiles.join(', ') || 'None';
    const topicsList = repoData.topics?.join(', ') || 'None';

    const prompt = `
You are an expert software architect and mentor. Your task is to analyze the following open-source project details and explain them in a way that helps a beginner developer understand the project and start contributing.

Project details:
- Project Name: ${repoData.projectName}
- Description: ${repoData.description || 'No description provided.'}
- Primary Language: ${repoData.language || 'Unknown'}
- Topics: ${topicsList}
- Folder Structure (Top-level directories): ${foldersList}
- Key Files: ${filesList}
- README Snippet:
"""
${readmeSnippet}
"""

Please analyze this data and generate a JSON response. You MUST return ONLY a valid JSON object matching the following structure. Do not wrap it in markdown block tags, just return the raw JSON:

{
  "projectName": "${repoData.projectName}",
  "overview": "A clear, welcoming, and concise overview (2-3 sentences) of what this project does and its core objective.",
  "architectureExplanation": "A high-level explanation of the codebase structure. Mention the key layers (frontend, backend, utilities, etc. as appropriate), design patterns, and how components interact. Explain what folders handle what responsibilities.",
  "importantFiles": ["List 3 to 5 key file paths that are crucial to understanding the core logic, such as entry points, routes, configurations, or main handlers."],
  "beginnerStartingPoint": "A practical, reassuring description of where a beginner should start exploring in the codebase (e.g. specific components or folders) and why it is a low-risk starting point.",
  "learningRoadmap": [
    "Step 1: What to learn/read first (e.g., clone the repo and review the entry point file)",
    "Step 2: What to check next (e.g., understand how configuration or routing works)",
    "Step 3: What to explore third (e.g., locate state management or database connection files)",
    "Step 4: Practice (e.g., find a good-first-issue or documentation task, run tests locally)"
  ]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().trim();
    
    // Parse response
    const parsedData = JSON.parse(jsonText);
    return parsedData;
  } catch (error) {
    console.error('❌ Error generating AI explanation, returning fallback:', error.message);
    return generateFallbackExplanation(repoData);
  }
};

/**
 * Smart offline generator in case Gemini API is not configured or errors out
 */
const generateFallbackExplanation = (repoData) => {
  const name = repoData.projectName || 'this project';
  const lang = repoData.language || 'JavaScript/TypeScript';
  const description = repoData.description || 'an open-source project';
  
  // Custom explanations based on folders
  const folders = repoData.folders.map(f => f.toLowerCase());
  const hasFrontend = folders.some(f => f.includes('client') || f.includes('frontend') || f.includes('src') || f.includes('public'));
  const hasBackend = folders.some(f => f.includes('server') || f.includes('backend') || f.includes('api') || f.includes('controllers'));
  const hasDb = folders.some(f => f.includes('db') || f.includes('database') || f.includes('models') || f.includes('schemas'));
  
  let archType = 'single-tier project';
  if (hasFrontend && hasBackend) {
    archType = 'Full Stack (Frontend + Backend) Client-Server application';
  } else if (hasFrontend) {
    archType = 'Frontend Web application';
  } else if (hasBackend) {
    archType = 'Backend Server API service';
  }

  const overview = `${name} is ${description.toLowerCase().replace(/\.$/, '')}. It is primarily written in ${lang} and designed as a clean, manageable open-source repository.`;
  
  let architectureExplanation = `This project follows a ${archType} layout. `;
  if (folders.length > 0) {
    architectureExplanation += `It divides its core responsibilities among top-level directories: ${repoData.folders.join(', ')}. `;
    if (hasFrontend) {
      architectureExplanation += 'User interface controls and page layouts are stored in frontend/client folders. ';
    }
    if (hasBackend) {
      architectureExplanation += 'Routing, server setups, and API logical handlers are located in backend/server directories. ';
    }
    if (hasDb) {
      architectureExplanation += 'Database schemas, Mongoose models, or seed files are managed within database/models modules. ';
    }
  } else {
    architectureExplanation += 'The codebase is compact, with files organized at the root level handling configuration, exports, and core functionality.';
  }

  const importantFiles = repoData.importantFiles.length > 0 
    ? repoData.importantFiles.slice(0, 4) 
    : ['package.json', 'README.md'];

  const beginnerStartingPoint = `Beginners should start by reviewing ${importantFiles[0]} to understand the dependencies and build commands. Next, read the README.md and check the ${repoData.folders[0] || 'main'} directory to trace how files load.`;

  const learningRoadmap = [
    `Step 1: Clone the repository and examine the configuration file (e.g. ${importantFiles[0] || 'package.json'}) to inspect packages.`,
    'Step 2: Read the README.md carefully to learn how to launch the project locally.',
    'Step 3: Dive into the main directory to understand component modularity and API route registration.',
    'Step 4: Locate issues labeled with "good first issue" or "documentation" to make your first commit.'
  ];

  return {
    projectName: name,
    overview,
    architectureExplanation,
    importantFiles,
    beginnerStartingPoint,
    learningRoadmap
  };
};

module.exports = {
  generateRepoExplanation
};
