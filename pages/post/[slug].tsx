import React from 'react'
import { useRouter } from 'next/router'

import {
  PostDetail,
  Categories,
  PostWidget,
  Author,
  Comments,
  CommentsForm,
  Loader,
} from '../../components'
import { getPosts, getPostDetails } from '../../services'
import { AdjacentPosts } from '../../sections'

const PostDetails = ({ post }: { post: any }): JSX.Element => {
  const router = useRouter()

  if (router.isFallback) {
    return <Loader />
  }

  return (
    <>
      <div className="container mx-auto mb-8 px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="col-span-1 lg:col-span-8">
            <PostDetail post={post} />
            <Author author={post.author} />
            <AdjacentPosts slug={post.slug} createdAt={post.createdAt} />
            <CommentsForm slug={post.slug} />
            <Comments slug={post.slug} />
          </div>
          <div className="col-span-1 lg:col-span-4">
            <div className="relative top-8 lg:sticky">
              <PostWidget
                slug={post.slug}
                categories={post.categories.map(
                  (category: any) => category.slug
                )}
              />
              <Categories />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default PostDetails

// Fetch data at build time
export async function getStaticProps({
  params,
}: {
  params: any
}): Promise<{ props: { post: any } }> {
  const data = await getPostDetails(params.slug)
  return {
    props: {
      post: data,
    },
  }
}

// Specify dynamic routes to pre-render pages based on data.
// The HTML is generated at build time and will be reused on each request.
export async function getStaticPaths() {
  const posts = await getPosts()
  return {
    paths: posts.map(function ({ node: { slug } }: { node: { slug: any } }): {
      params: { slug: any }
    } {
      return { params: { slug } }
    }),
    fallback: true,
  }
}
