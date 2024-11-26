<template>
  <v-dialog width="auto" @keydown.enter="deleteItemConfirm">
    <v-card
      :min-width="$vuetify.display.mobile ? 'auto' : '450'"
      prepend-icon="mdi-delete"
      text="This action can not be undo"
      title="Are you sure?"
    >
      <template v-slot:actions>
        <v-btn
          text="Ok"
          variant="flat"
          color="red"
          @click="deleteItemConfirm"
          :disabled="isPending"
          :loading="isPending"
        ></v-btn>
        <v-btn
          text="Cancel"
          variant="outlined"
          color="gray"
          :disabled="isPending"
          @click="$emit('update:modelValue', false)"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { useTodos } from "@/hooks";

// Emits an event when the delete action is successful
const emits = defineEmits(["onSuccess"]);

// Destructure the delete todo hook
const { useDeleteTodo } = useTodos();
const { isPending, mutate } = useDeleteTodo();

// Define props to access the activeTodo data
const props = defineProps({
  activeTodo: Object, // activeTodo contains the todo to be deleted
});

// Function to handle the confirmation of item deletion
const deleteItemConfirm = () => {
  // Perform deletion and trigger the success event on completion
  deleteTodoById(props.activeTodo.id);
};

// Helper function to delete a todo by its ID
const deleteTodoById = (todoId) => {
  mutate(todoId, {
    onSuccess: handleDeleteSuccess,
  });
};

// Handle the success response after deletion
const handleDeleteSuccess = () => {
  emits("onSuccess"); // Emit success event to parent component
};
</script>
