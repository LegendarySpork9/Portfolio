const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER;
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO;
const GITHUB_FILE_PATH = import.meta.env.VITE_GITHUB_FILE_PATH;

export async function getUpcomingProjects(): Promise<string> {
  const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${GITHUB_FILE_PATH}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch upcoming projects: ${response.status}`);
  }

  return response.text();
}
