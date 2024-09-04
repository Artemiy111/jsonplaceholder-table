export type Post = {
  userId: number
  id: number
  title: string
  body: string
}

export type SortingMode = 'asc' | 'desc'

export const usePostsStore = defineStore('posts', () => {
  const PAGE_SIZE = 10
  const API_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts'

  const rawPosts = ref<Post[]>([])
  const isLoading = ref(false)
  const page = ref(1)

  const maxPages = computed(() => Math.ceil(rawPosts.value.length / PAGE_SIZE))
  const canGetNextPage = computed(() => page.value <= maxPages.value)
  const canGetPrevPage = computed(() => page.value >= 1)
  const sortingMode = ref<SortingMode>('asc')

  function loadPage(newPage: number) {
    isLoading.value = true
    setTimeout(() => {
      if (1 <= newPage && newPage <= maxPages.value) page.value = newPage
      isLoading.value = false
    }, 1000)
  }

  const paginatedPosts = computed(() => rawPosts.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))

  const sortedPosts = computed(() => sortingMode.value === 'asc' ?
    paginatedPosts.value.toSorted((a, b) => a.id - b.id) :
    paginatedPosts.value.toSorted((a, b) => b.id - a.id)
  )

  function toggleSortingMode() {
    console.log('toggle')
    if (sortingMode.value === 'asc') sortingMode.value = 'desc'
    else sortingMode.value = 'asc'
  }

  async function loadPosts() {
    isLoading.value = true
    const data = await fetch(API_ENDPOINT)
    const res = await data.json() as Post[] // need validation and error handling
    console.log(res)
    rawPosts.value = res
    isLoading.value = false
  }

  const currentId = computed(() => rawPosts.value.length)
  function getNextId() {
    return currentId.value + 1
  }

  function addPost(post: Omit<Post, 'id'>) {
    const newPost = { ...post, id: getNextId() }
    console.log(newPost)
    rawPosts.value.push(newPost)
  }

  return {
    MAX_PAGES: maxPages,
    PAGE_SIZE,
    isLoading,
    posts: sortedPosts,
    page,
    sortingMode,
    toggleSortingMode,
    loadPosts,
    loadPage,
    canGetNextPage,
    canGetPrevPage,
    addPost,
    paginatedPosts,
  }
})