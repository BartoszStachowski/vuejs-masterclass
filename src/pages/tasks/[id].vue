<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute('/tasks/[id]');

const { task } = storeToRefs(useTasksStore());

watch(
  () => task.value?.name,
  () => {
    usePageStore().pageData.title = `Task: ${task.value?.name || ''}`;
  },
);

const { getTask, updateTask } = useTasksStore();

await getTask(route.params.id);

const { getProfilesByIds } = useCollaborators();
const collaborators = task.value?.collaborators
  ? await getProfilesByIds(task.value.collaborators)
  : [];
</script>

<template>
  <Table v-if="task">
    <TableRow>
      <TableHead>Name</TableHead>
      <TableCell>
        <AppInPlaceEditText v-model="task.name" @commit="updateTask" />
      </TableCell>
    </TableRow>
    <TableRow>
      <TableHead>Description</TableHead>
      <TableCell>
        <AppInPlaceEditTextarea class="h-20" v-model="task.description" @commit="updateTask" />
      </TableCell>
    </TableRow>
    <TableRow>
      <TableHead>Project</TableHead>
      <TableCell>{{ task.projects?.name }}</TableCell>
    </TableRow>
    <TableRow>
      <TableHead>Status</TableHead>
      <TableCell>
        <AppInPlaceEditStatus v-model="task.status" @commit="updateTask" />
      </TableCell>
    </TableRow>
    <TableRow>
      <TableHead>Collaborators</TableHead>
      <TableCell>
        <div class="flex">
          <Avatar
            class="-mr-4 border border-primary hover:scale-110 transition-transform"
            v-for="collab in collaborators"
            :key="collab.id"
          >
            <RouterLink
              class="w-full h-full flex items-center justify-center"
              :to="{ name: '/users/[username]', params: { username: collab.username } }"
            >
              <AvatarImage :src="collab.avatar_url || ''" alt="avatar" />
              <AvatarFallback> </AvatarFallback>
            </RouterLink>
          </Avatar>
        </div>
      </TableCell>
    </TableRow>
    <TableRow class="hover:bg-transparent">
      <TableHead class="align-top pt-4">Comments</TableHead>

      <TableCell>
        Comments cards goes in here..

        <div class="flex flex-col justify-between p-3 bg-muted my-2 rounded-md">
          <textarea
            placeholder="Add your comment.."
            class="w-full max-w-full overflow-y-auto prose-sm prose border rounded dark:prose-invert hover:border-muted bg-background border-muted p-3"
          >
          </textarea>
          <div class="flex justify-between mt-3">
            <Button> Comment </Button>
            <div class="flex gap-4">
              <button variant="ghost" @click.prevent>
                <iconify-icon icon="lucide:paperclip"></iconify-icon>
                <span class="sr-only">Attach file</span>
              </button>
              <button variant="ghost" @click.prevent>
                <iconify-icon icon="lucide:image-up"></iconify-icon>

                <span class="sr-only">Upload image</span>
              </button>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  </Table>
</template>

<style scoped>
@reference "@/index.css";

th {
  @apply w-[100px];
}

td {
  text-wrap: auto;
}

h2 {
  @apply mb-4 text-lg font-semibold w-fit;
}

.table-container {
  @apply overflow-hidden overflow-y-auto rounded-md bg-slate-900 h-80;
}
</style>
