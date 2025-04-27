export const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://api.canalcursos.com.br/api'
    : 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 30000,
  retries: 2
};