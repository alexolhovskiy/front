
// // Объединенная функция для `GET` и `POST` запросов
// export const fetchApi = async (url, method, data) => {
//   let response;

//   // Базовые настройки для всех запросов
//   const headers = {
//     'Content-Type': 'application/json',
//   };
//   const options = {
//     method,
//     headers,
//   };

//   if (method === 'GET' && data) {
//     // Обрабатываем данные для GET запроса
//     const queryString = new URLSearchParams(data).toString();
//     response = await fetch(`${url}?${queryString}`, options);
//   } else if (method === 'POST' && data) {
//     // Обрабатываем данные для POST запроса
//     options.body = JSON.stringify(data);
//     response = await fetch(url, options);
//   } else {
//     // Для других типов запросов, которые могут не использовать данные
//     response = await fetch(url, options);
//   }

//   // Проверка ответа и возвращение данных
//   if (!response.ok) {
//     throw new Error('Request failed');
//   }
//   const temp = await response.json();
//   console.log(temp);
//   return temp;
// };

export const fetchApi = async (url, method, data = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // ⛓️ Добавляем токен, если есть
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (data && method === 'POST') {
    options.body = JSON.stringify(data);
  } else if (data && method === 'GET') {
    url += '?' + new URLSearchParams(data).toString();
  }

  const res = await fetch(url, options);
  if (!res.ok) throw new Error('Request failed');
  return res.json();
};
