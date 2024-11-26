import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";
import { TodoService } from "@/services";
import { todoEnums } from "@/enums";

export const useTodos = () => {
  const queryClient = useQueryClient();

  // Mutation for adding a new todo
  const useAddTodo = () => {
    return useMutation({
      mutationFn: (payload) => TodoService.addTodo(payload),
    });
  };

  // Query for fetching the list of todos
  const useFetchTodos = () => {
    const query = useQuery({
      queryKey: ["todos"], // Unique query key
      queryFn: TodoService.getTodos, // Fetch todos from the service
      onSuccess: (data) => {
        state.todos = data; // Update state with fetched todos
      },
    });

    return {
      ...query,
      todos: computed(() => query.data.value || []), // Computed property for todos
    };
  };

  // Mutation for deleting a todo by its ID
  const useDeleteTodo = () => {
    return useMutation({
      mutationFn: (todoId) => TodoService.deleteTodo(todoId),
    });
  };

  // Mutation for updating a todo
  const useUpdateTodo = () => {
    return useMutation({
      mutationFn: ({ todoId, payload }) =>
        TodoService.updateTodo(todoId, payload),
    });
  };

  // Handle toggling a todo's completion status
  const handleToggleTodoStatus = (item, value) => {
    const updatePayload = {
      ...item,
      checked: value,
      status: value ? todoEnums.status.Completed : todoEnums.status.Active,
    };

    // Update the todo and refetch the todos list
    TodoService.updateTodo(item.id, updatePayload).then(() => {
      queryClient.refetchQueries(["todos"]);
    });
  };

  // Expose the custom hooks and utility functions
  return {
    useAddTodo,
    useFetchTodos,
    useDeleteTodo,
    useUpdateTodo,
    handleToggleTodoStatus,
  };
};
