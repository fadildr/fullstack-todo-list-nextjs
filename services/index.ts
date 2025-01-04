import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;

    if (response?.status === 401) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }

    return Promise.reject(error);
  }
);

const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/signin", {
      email,
      password,
    });

    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "An unexpected error occurred."
    );
  }
};

const createTask = async (data: any) => {
  try {
    const response = await axiosInstance.post("/tasks", data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "An unexpected error occurred."
    );
  }
};

const tasks = async (data: Record<string, any>) => {
  try {
    const { search, status, assignedUserId, page, limit, sortBy, sortOrder } =
      data;

    const queryParams = new URLSearchParams(
      Object.entries({
        search,
        status,
        assignedUserId,
        page: page !== undefined ? String(page) : undefined,
        limit: 100,
        sortBy,
        sortOrder,
      }).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const response = await axiosInstance.get(`/tasks?${queryParams}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "An unexpected error occurred."
    );
  }
};

const updateTask = async (data: any) => {
  try {
    const response = await axiosInstance.put(`/tasks`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "An unexpected error occurred."
    );
  }
};
const getUsers = async () => {
  try {
    const response = await axiosInstance.get("/user");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "An unexpected error occurred."
    );
  }
};
const getDetailUser = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/user/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "An unexpected error occurred."
    );
  }
};

export { login, createTask, tasks, getUsers, updateTask, getDetailUser };
