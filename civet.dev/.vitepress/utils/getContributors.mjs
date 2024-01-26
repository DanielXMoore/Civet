const token = process.env.API_TOKEN;

export async function getContributors() {
  const headers = {};

  if (token) {
    console.log('Using process.env.API_TOKEN');
    headers['Authorization'] = `Bearer ${token}`;
  }

  const result = await fetch(
    'https://api.github.com/repos/DanielXMoore/Civet/contributors',
    { headers }
  )
  const json = await result.json()
  return json
    .filter((user) => user.type.toLowerCase() === 'user')
    .map((user) => {
      const { login, contributions, html_url, avatar_url } = user;
      return {
        href: html_url,
        avatar: avatar_url,
        login,
        contributions,
      };
    });
}
