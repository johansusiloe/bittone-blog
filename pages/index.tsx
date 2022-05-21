import { FeaturedPosts } from '../sections/index'
import { PostCard, Categories, PostWidget } from '../components'
import { getPosts } from '../services'

export default function Home({ posts }: { posts: any }) {
  return (
    <div className="container mx-auto mb-8 px-10">
      <FeaturedPosts />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="col-span-1 lg:col-span-8">
          {posts.map((post: any | string, index: number) => (
            <PostCard key={index} post={post.node} />
          ))}
        </div>
        <div className="col-span-1 lg:col-span-4">
          <div className="relative top-8 lg:sticky">
            <PostWidget categories={[]} slug={''} />
            <Categories />
          </div>
        </div>
      </div>
    </div>
  )
}

// Fetch data at build time
export async function getStaticProps() {
  const posts = (await getPosts()) || []
  return {
    props: { posts },
  }
}
