<template>
  <v-card elevation="4" max-width="600" class="mx-auto my-10">
    <v-form
      @submit.prevent="formHandler"
      v-model="data.isFormValid"
      ref="formRef"
    >
      <v-container>
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="data.todoTitle"
              :rules="data.todoTitleRules"
              label="Enter Title"
              variant="outlined"
              density="compact"
            ></v-text-field>
          </v-col>
          <v-col cols="12" :md="editMode ? 2 : 4">
            <v-btn
              type="submit"
              block
              variant="flat"
              :color="editMode ? 'orange' : 'green'"
              height="40"
              :loading="isPending || isPendingUpdate"
              :disabled="isPending || isPendingUpdate"
            >
              {{ editMode ? "Update" : "Add" }}
            </v-btn>
          </v-col>
          <v-col cols="12" md="2" v-if="editMode">
            <v-btn
              block
              variant="flat"
              color="blue"
              height="40"
              @click="cancelEdit"
            >
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script setup>
import { nextTick, reactive, ref, watch } from "vue";
import { useTodos } from "@/hooks";
import { useQueryClient } from "@tanstack/vue-query";
import { todoEnums } from "@/enums";

// Define props and emits for managing input and communication with parent component
const props = defineProps({
  editMode: Boolean, // Whether we are editing an existing todo
  activeTodo: Object, // The active todo item when in edit mode
});
const emits = defineEmits(["onFinishUpdate"]);

// Reactive state for managing the form and its validation
const formRef = ref(null);
const data = reactive({
  isFormValid: false,
  todoTitle: "",
  todoTitleRules: [(value) => !!value || "This field is required."], // Validation rule
});

// Use query client for refetching todos after mutation
const queryClient = useQueryClient();
const { useAddTodo, useUpdateTodo } = useTodos();
const { mutate: addTodo, isPending } = useAddTodo();
const { mutate: updateTodo, isPending: isPendingUpdate } = useUpdateTodo();

// Centralized handler for form submission (Add or Update)
const formHandler = () => {
  if (data.isFormValid) {
    const todoPayload = createTodoPayload(data.todoTitle);

    if (props.editMode) {
      // Update todo when in edit mode
      updateTodo(
        { todoId: props.activeTodo.id, payload: todoPayload },
        { onSuccess: handleSuccess }
      );
    } else {
      // Create a new todo
      addTodo(todoPayload, { onSuccess: handleSuccess });
    }
  }
};

// Helper to generate todo payload
const createTodoPayload = (title) => ({
  title,
  checked: false,
  status: todoEnums.status.Active,
});

// Success handler to reset form and refetch todos
const handleSuccess = () => {
  queryClient.refetchQueries(["todos"]);
  data.todoTitle = ""; // Clear the input field
  nextTick(() => formRef.value.resetValidation()); // Reset validation state
  emits("onFinishUpdate"); // Notify parent about the update
};

// Cancel edit mode and reset form
const cancelEdit = () => {
  data.todoTitle = "";
  nextTick(() => formRef.value.resetValidation());
  emits("onFinishUpdate"); // Notify parent about the cancellation
};

// Watch for changes in activeTodo to pre-fill form when editing
watch(
  () => props.activeTodo,
  (newTodo) => {
    if (props.editMode && newTodo) {
      data.todoTitle = newTodo.title; // Populate the title if editing
    }
  }
);
</script>
