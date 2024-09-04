<script setup lang="ts">
import { usePostsStore } from './stores/posts.store'
import Throbber from '~/components/Throbber.vue'

const store = usePostsStore()

const refDialog = ref<HTMLDialogElement>(null!)

const title = ref('')
const body = ref('')

const userId = computed(() => store.posts[0]?.userId)

const canAddPost = computed(() => title.value && body.value)

function addPost() {
  store.addPost({
    userId: userId.value,
    title: title.value,
    body: body.value,
  })
  refDialog.value.close()
}

store.loadPosts()
</script>

<template>
  <main class="p-16 text-xl">
    <dialog ref="refDialog" class="w-[500px] p-8 bg-white">
      <form @submit.prevent="addPost" class="flex flex-col gap-2">
        <label for="">
          UserID
          <span> {{ userId }}</span>
        </label>
        <label for="" class="flex gap-2">
          Title
          <input class="bg-slate-100 w-full" type="text" v-model="title" />
        </label>
        <label class="flex items-start gap-2">
          Body
          <textarea class="bg-slate-100 w-full" name="" id="" v-model="body"></textarea>
        </label>
        <button
          :disabled="!canAddPost"
          class="pb-2 pt-1 px-4 bg-slate-100 rounded-lg disabled:bg-slate-50"
        >
          Add post
        </button>
      </form>
    </dialog>

    <div class="flex gap-4">
      <h1 class="font-bold text-4xl">Posts</h1>

      <button
        :disabled="store.isLoading"
        @click="refDialog.showModal()"
        class="pb-2 pt-1 px-4 bg-slate-100 rounded-lg disabled:bg-slate-50"
      >
        New
      </button>
    </div>

    <div class="flex gap-2 mt-6">
      <span
        v-for="page in store.MAX_PAGES"
        @click="store.loadPage(page)"
        :class="[
          'cursor-pointer',
          page === store.page ? 'text-blue-500 cursor-auto pointer-events-none' : '',
        ]"
        >{{ page }}</span
      >
    </div>

    <table class="grid grid-cols-[50px_50px_300px_1fr] w-full mt-2 gap-x-8">
      <thead class="grid grid-cols-subgrid col-span-4">
        <tr class="grid grid-cols-subgrid col-span-4 border-b pb-2">
          <th class="text-start flex gap-2">
            <span>Id</span>
            <button class="cursor-pointer" @click="store.toggleSortingMode">
              <span :class="[store.sortingMode === 'asc' ? '' : 'text-slate-400']">&uarr;</span>
              <span :class="[store.sortingMode === 'asc' ? 'text-slate-400' : '']">&darr;</span>
            </button>
          </th>
          <th class="text-start">UserId</th>
          <th class="text-start">Title</th>
          <th class="text-start">Body</th>
        </tr>
      </thead>
      <tbody class="grid grid-cols-subgrid col-span-4">
        <Throbber
          v-if="store.isLoading"
          class="mt-2 animate-spin w-16 h-16 [animation-duration:3s]"
        />

        <tr
          v-else
          class="grid grid-cols-subgrid col-span-4 border-b last:border-b-0 py-2"
          v-for="post in store.posts"
          :key="post.id"
        >
          <td>{{ post.id }}</td>
          <td>{{ post.userId }}</td>
          <td>{{ post.title }}</td>
          <td>{{ post.body }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>
