// Import the request service to interact with the API
import { request } from "@/services";

const makeRequest = async (method, url, payload = null) => {
  // Make the HTTP request and return the response data
  const response = await request({ method, url, data: payload });
  return response.data;
};

// TodoService object with CRUD operations for todos
export const TodoService = {
  getTodos() {
    return makeRequest("get", "/todos");
  },

  deleteTodo(todoId) {
    return makeRequest("delete", `/todos/${todoId}`);
  },

  addTodo(payload) {
    return makeRequest("post", "/todos", payload);
  },

  updateTodo(todoId, payload) {
    return makeRequest("put", `/todos/${todoId}`, payload);
  },
};
