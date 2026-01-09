import type { Blog } from '~/types'

export const useBlogStore = () => {
  const { get, post, put, delete: del } = useApi()

  // Global state for blogs list (cached in memory)
  const blogs = useState<Blog[]>('blogs', () => [])

  // Loading states
  const loading = useState<boolean>('blogsLoading', () => false)
  const loadingBlog = useState<number | null>('loadingBlog', () => null)

  // Fetch all blogs (with caching - only fetches if cache is empty or force refresh)
  const fetchBlogs = async (force = false) => {
    // Return cached data if available and not forcing refresh
    if (!force && blogs.value.length > 0) {
      return blogs.value
    }

    try {
      loading.value = true
      const data = await get<Blog[]>('/blogs')
      blogs.value = data
      return data
    } catch (error) {
      console.error('Error fetching blogs:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Get a single blog by ID (checks blogs array first, then fetches if not found)
  const getBlog = async (id: number, force = false): Promise<Blog | null> => {
    // Check if blog exists in blogs array first
    if (!force) {
      const cachedBlog = blogs.value.find(b => b.id === id)
      if (cachedBlog) {
        return cachedBlog
      }
    }

    try {
      loadingBlog.value = id
      const data = await get<Blog>(`/blogs/${id}`)

      if (data) {
        // Update in blogs list if it exists there, otherwise add it
        const index = blogs.value.findIndex(b => b.id === id)
        if (index !== -1) {
          blogs.value[index] = data
        } else {
          blogs.value.push(data)
        }
      }

      return data
    } catch (error) {
      console.error(`Error fetching blog ${id}:`, error)
      throw error
    } finally {
      loadingBlog.value = null
    }
  }

  // Create a new blog
  const createBlog = async (blogData: { title: string; content: string; user_id: string }): Promise<Blog> => {
    try {
      const data = await post<Blog>('/blogs', blogData)
      // Add to blogs list (prepend to show newest first)
      blogs.value.unshift(data)
      return data
    } catch (error) {
      console.error('Error creating blog:', error)
      throw error
    }
  }

  // Update a blog
  const updateBlog = async (id: number, blogData: { title?: string; content?: string }): Promise<Blog | null> => {
    try {
      const data = await put<Blog>(`/blogs/${id}`, blogData)

      if (data) {
        // Update in blogs list
        const index = blogs.value.findIndex(b => b.id === id)
        if (index !== -1) {
          blogs.value[index] = data
        }
      }

      return data
    } catch (error) {
      console.error(`Error updating blog ${id}:`, error)
      throw error
    }
  }

  // Delete a blog
  const deleteBlog = async (id: number): Promise<void> => {
    try {
      await del(`/blogs/${id}`)
      // Remove from blogs list
      blogs.value = blogs.value.filter(b => b.id !== id)
    } catch (error) {
      console.error(`Error deleting blog ${id}:`, error)
      throw error
    }
  }

  // Clear cache (useful for logout or refresh)
  const clearCache = () => {
    blogs.value = []
  }

  return {
    // State
    blogs: readonly(blogs),
    loading: readonly(loading),
    loadingBlog: readonly(loadingBlog),

    // Methods
    fetchBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    clearCache,
  }
}

