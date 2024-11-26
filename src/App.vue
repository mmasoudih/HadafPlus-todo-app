<template>
  <v-layout>
    <v-app-bar color="teal-darken-4" height="100">
      <template v-slot:image>
        <v-img
          gradient="to top right, rgba(19,84,122,.6), rgba(128,208,199,.6)"
        ></v-img>
      </template>

      <v-app-bar-title>Todo APP</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <TodoDeleteDialog
          v-model="todoData.dialogDelete"
          :active-todo="todoData.activeTodo"
          @on-success="
            () => {
              todoData.dialogDelete = false;
              todoData.activeTodo = {};
              refetch();
            }
          "
        />
        <TodoForm
          :edit-mode="todoData.editMode"
          :active-todo="todoData.activeTodo"
          @on-finish-update="todoData.editMode = false"
        />
        <TodoTable
          :is-loading="!!isFetching || !!isMutatingPosts"
          :data="data"
          @on-delete="onDeleteTodo"
          @on-update="onUpdateTodo"
        />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import { reactive } from "vue";
import { useTodos } from "@/hooks";
import { useIsFetching, useIsMutating } from "@tanstack/vue-query";
// Components
import TodoForm from "./components/TodoForm.vue";
import TodoTable from "./components/TodoTable.vue";
import TodoDeleteDialog from "./components/TodoDeleteDialog.vue";

// State for managing todo data and dialog states
const todoData = reactive({
  dialogDelete: false,
  activeTodo: {},
  editMode: false,
});

// Hooks for fetching todos and managing request states
const { useFetchTodos } = useTodos();
const { refetch, data } = useFetchTodos();
const isMutatingPosts = useIsMutating();
const isFetching = useIsFetching();

const setActiveTodo = (item, mode = null) => {
  todoData.activeTodo = { ...item };
  if (mode !== null) {
    todoData.editMode = mode;
  }
};

const onDeleteTodo = (item) => {
  setActiveTodo(item);
  todoData.dialogDelete = true;
};

const onUpdateTodo = (item) => {
  setActiveTodo(item, true);
};
</script>
