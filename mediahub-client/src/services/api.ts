const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const TOKEN_KEY = 'mediahub_token';

// Отримати токен з localStorage
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Зберегти токен в localStorage
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Видалити токен з localStorage
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Базова функція для виконання запитів з автоматичним додаванням токену
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Якщо отримали 401, видаляємо токен
  if (response.status === 401) {
    removeToken();
    window.location.href = '/login';
  }

  return response;
};

// API для авторизації
export const authApi = {
  register: async (username: string, email: string, password: string) => {
    const response = await apiRequest('/Auth/Register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    const token = await response.text(); // Токен приходить як plain text
    if (token) {
      setToken(token);
    }
    return token;
  },

  login: async (username: string, password: string) => {
    const response = await apiRequest('/Auth/Login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    const token = await response.text(); // Токен приходить як plain text
    if (token) {
      setToken(token);
    }
    return token;
  },

  getUsername: async (userId: string) => {
    const response = await apiRequest(`/Auth/GetUsername/${userId}`);
    return response.text(); // Повертає username як plain text
  },

  getUserInfo: async () => {
    const response = await apiRequest('/Auth/GetUserInfo');
    return response.json();
  },

  logout: () => {
    removeToken();
  },
};

// API для фото
export const photoApi = {
  getById: async (id: string) => {
    const response = await apiRequest(`/Photo/GetById/${id}`);
    return response.json();
  },

  getPaged: async (page: number, perPage: number) => {
    const response = await apiRequest(`/Photo/GetPaged/${page}/${perPage}`);
    return response.json();
  },

  getForUserPaged: async (page: number, perPage: number) => {
    const response = await apiRequest(`/Photo/GetForUserPaged/${page}/${perPage}`);
    return response.json();
  },

  getForAlbumPaged: async (albumId: string, page: number, pageSize: number) => {
    const response = await apiRequest(`/Photo/GetForAlbumPaged/${albumId}/${page}/${pageSize}`);
    return response.json();
  },

  getReactionsCount: async (id: string) => {
    const response = await apiRequest(`/Photo/GetReactionsCount/${id}`);
    return response.json();
  },

  add: async (file: File, description: string, albumId?: string) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    if (albumId) {
      formData.append('albumId', albumId);
    }

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/Photo/Add`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (response.status === 401) {
      removeToken();
      window.location.href = '/login';
    }

    return response.json();
  },

  remove: async (id: string) => {
    const response = await apiRequest(`/Photo/Remove/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// API для альбомів
export const albumApi = {
  getAll: async () => {
    const response = await apiRequest('/Albums/GetAll');
    return response.json();
  },

  getAllForUser: async () => {
    const response = await apiRequest('/Albums/GetAllForUser');
    return response.json();
  },

  getById: async (id: string) => {
    const response = await apiRequest(`/Albums/GetById?id=${id}`);
    return response.json();
  },

  add: async (title: string) => {
    const response = await apiRequest('/Albums/Add', {
      method: 'POST',
      body: JSON.stringify(title),
    });
    return response.json();
  },

  update: async (album: any) => {
    const response = await apiRequest('/Albums/Update', {
      method: 'PUT',
      body: JSON.stringify(album),
    });
    return response.json();
  },

  addPhotos: async (albumId: string, photoIds: string[]) => {
    const response = await apiRequest(`/Albums/AddPhotos?id=${albumId}`, {
      method: 'PUT',
      body: JSON.stringify(photoIds),
    });
    return response.json();
  },

  removePhotos: async (albumId: string, photoIds: string[]) => {
    const response = await apiRequest(`/Albums/RemovePhotos/${albumId}`, {
      method: 'PUT',
      body: JSON.stringify(photoIds),
    });
    return response.json();
  },

  remove: async (id: string) => {
    const response = await apiRequest(`/Albums/Remove?id=${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// API для реакцій
export const reactionApi = {
  getAllForPhoto: async (photoId: string) => {
    const response = await apiRequest(`/Reactions/GetAllForPhoto?photoId=${photoId}`);
    return response.json();
  },

  add: async (photoId: string, type: number) => {
    const response = await apiRequest('/Reactions/Add', {
      method: 'POST',
      body: JSON.stringify({ photoId, type }),
    });
    return response.json();
  },

  remove: async (id: string) => {
    const response = await apiRequest('/Reactions/Remove', {
      method: 'DELETE',
      body: JSON.stringify(id),
    });
    return response.json();
  },
};
