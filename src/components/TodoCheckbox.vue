<template>
  <v-checkbox-btn
    v-model="isChecked"
    @change="onChangeStatus({ item, value: isChecked })"
  ></v-checkbox-btn>
</template>
<script setup>
import { useTodos } from "@/hooks";
import { useQueryClient } from "@tanstack/vue-query";
import { ref, watch } from "vue";
import { todoEnums } from "@/enums";

// Define props to access the todo item
const props = defineProps({
  item: Object, // The todo item being updated
});

// Destructure the update todo hook and query client
const { useUpdateTodo } = useTodos();
const queryClient = useQueryClient();
const { mutate: updateTodoMutate } = useUpdateTodo(props.item.id);

// Local state for tracking checked status
const isChecked = ref(props.item.checked);

// Handle the change in todo item status (checked/unchecked)
const onChangeStatus = ({ item, value }) => {
  const updatedTodo = {
    ...item,
    checked: value,
    status: value ? todoEnums.status.Completed : todoEnums.status.Active,
  };

  updateTodoMutate(
    { todoId: item.id, payload: updatedTodo },
    { onSuccess: handleUpdateSuccess }
  );
};

// Success handler after a successful todo update
const handleUpdateSuccess = () => {
  queryClient.refetchQueries(["todos"]);
};

// Watch for changes in the checked status of the todo item
watch(
  () => props.item.checked,
  (newValue) => {
    isChecked.value = newValue; // Update local state when the prop changes
  },
  { immediate: true }
);
</script>
