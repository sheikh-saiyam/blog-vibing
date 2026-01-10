export type UserRole = "USER" | "ADMIN" | "MODERATOR"
export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED"
export type PostStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED"
export type CommentStatus = "APPROVED" | "REJECTED"

export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  role: UserRole
  status: UserStatus
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  title: string
  content: string
  thumbnail: string | null
  isFeatured: boolean
  status: PostStatus
  tags: string[]
  views: number
  authorId: string
  author: User
  comments: Comment[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  content: string
  status: CommentStatus
  authorId: string
  author: User
  postId: string
  parentId: string | null
  parent: Comment | null
  replies: Comment[]
  createdAt: string
  updatedAt: string
}

export interface PostsResponse {
  success: boolean
  message: string
  data: Post[]
  meta: {
    total: number
    page: number
    totalPages: number
    limit: number
  }
}

export interface StatsResponse {
  success: boolean
  message: string
  data: {
    totalPosts: number
    totalViews: number
    totalComments: number
    userPostCount: number
    adminPostCount: number
  }
}
