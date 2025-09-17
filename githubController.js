// githubController.js
const { Octokit } = require("@octokit/rest");

// Inisialisasi Octokit dengan token
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// ==========================
// 📂 GitHub File Controller
// ==========================

async function viewRepoFiles(owner, repo) {
  const res = await octokit.repos.getContent({ owner, repo, path: "" });
  return res.data.map(f => (f.type === "dir" ? `📁 ${f.name}/` : `📄 ${f.name}`));
}

async function listPath(owner, repo, filePath) {
  const res = await octokit.repos.getContent({ owner, repo, path: filePath });
  if (Array.isArray(res.data)) {
    return res.data.map(f => (f.type === "dir" ? `📁 ${f.name}/` : `📄 ${f.name}`));
  } else {
    return Buffer.from(res.data.content, "base64").toString("utf-8");
  }
}

async function addFile(owner, repo, filePath, content) {
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: `Add ${filePath} via Telegram Bot`,
    content: Buffer.from(content).toString("base64"),
  });
}

async function updateFile(owner, repo, filePath, content) {
  const { data } = await octokit.repos.getContent({ owner, repo, path: filePath });
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: `Update ${filePath} via Telegram Bot`,
    content: Buffer.from(content).toString("base64"),
    sha: data.sha,
  });
}

async function deleteFile(owner, repo, filePath) {
  const { data } = await octokit.repos.getContent({ owner, repo, path: filePath });
  await octokit.repos.deleteFile({
    owner,
    repo,
    path: filePath,
    message: `Delete ${filePath} via Telegram Bot`,
    sha: data.sha,
  });
}

module.exports = {
  viewRepoFiles,
  listPath,
  addFile,
  updateFile,
  deleteFile,
};