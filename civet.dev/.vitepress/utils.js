import axios from 'axios';

export function getContributors() {
  const headers = {
    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
  };

  return axios
    .get('https://api.github.com/repos/DanielXMoore/Civet/contributors', {
      headers
    })
    .then((res) => {
      return res.data
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
    });
}
