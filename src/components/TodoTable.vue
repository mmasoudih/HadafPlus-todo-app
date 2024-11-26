<template>
  <v-row dense>
    <v-select
      clearable
      chips
      label="Filter By Status"
      v-model="activeFilter"
      :items="[todoEnums.status.Active, todoEnums.status.Completed]"
      variant="outlined"
      :maxWidth="300"
    ></v-select>

    <v-data-table
      :loading="isLoading"
      :items="filteredData"
      :headers="[
        { title: '', key: 'checkbox', sortable: false },
        { title: 'Title', key: 'title', sortable: false },
        { title: 'Status', key: 'status', sortable: false },
        { title: 'Date', key: 'createdDate', sortable: false },
        { title: 'Action', key: 'actions', sortable: false },
      ]"
    >
      <template v-slot:item.checkbox="{ item }">
        <TodoCheckbox :item="item" />
      </template>
      <template v-slot:item.title="{ item }">
        <span :style="getItemStyle(item)">{{ item.title }}</span>
      </template>

      <template v-slot:item.status="{ item: { status } }">
        <v-chip :color="getStatusColor(status)" variant="elevated">
          {{ status }}
        </v-chip>
      </template>
      <template v-slot:item.createdDate="{ item: { createdDate } }">
        {{
          new Date(createdDate).toLocaleDateString("fa-IR-u-nu-latn", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="$emit('onUpdate', item)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="$emit('onDelete', item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-row>
</template>
<script setup>
import { todoEnums } from "@/enums";
import TodoCheckbox from "./TodoCheckbox.vue";
import { computed, ref } from "vue";

// Define props the component expects
const props = defineProps({
  data: {
    type: Array, // The todo data should be an array
    required: true,
  },
  isLoading: Boolean, // Indicates whether the todo data is being loaded
});

// Define custom events this component can emit
defineEmits(["onDelete", "onUpdate", "onChangeStatus"]);

const activeFilter = ref(null); // Filter state for todos

// Filter todos based on the active filter
const filteredData = computed(() => {
  if (!activeFilter.value) return props.data || []; // No filter applied, return all data
  return props.data?.filter((item) => item.status === activeFilter.value) || []; // Filter by status
});

// Get the status color based on the todo's state
const getStatusColor = (status) => {
  const statusColors = {
    [todoEnums.status.Completed]: "green", // Completed todos are green
    [todoEnums.status.Active]: "orange", // Active todos are orange
  };
  return statusColors[status] || "gray"; // Default color if status is unknown
};

// Get the style for the item based on its status (e.g., line-through for completed)
const getItemStyle = (item) => ({
  textDecoration:
    item.status === todoEnums.status.Completed ? "line-through" : "inherit",
  opacity: item.status === todoEnums.status.Completed ? 0.5 : 1,
});
</script>
