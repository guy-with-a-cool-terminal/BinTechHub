const handleGithubConnect = () => {
  try {
    api.startGitHubOAuth();
  } catch (error) {
    alert("Failed to start GitHub OAuth. Please try again.");
    console.error(error);
  }
};
