import axios from 'axios';

const token = process.env.API_TOKEN

export function getContributors() {
  const headers = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

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
