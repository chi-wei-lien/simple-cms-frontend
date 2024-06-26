'use server'
import { Post } from '../types/field'

const getPosts = async (groupId: string) => {
  const paramsObj = { 'group-id': groupId }
  const searchParams = new URLSearchParams(paramsObj)
  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/get-posts?${searchParams}`

  const response = await fetch(apiUrl, {
    method: 'GET',
    next: {
      tags: ['posts'],
    },
  })

  const posts = (await response.json()) as Post[]

  for (const post of posts) {
    post['editUrl'] = `/edit-post/${groupId}/${post.postId}`
  }

  return posts
}

export default getPosts
