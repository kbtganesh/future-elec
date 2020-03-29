import Link from 'next/link'

function About({ posts }) {
    return (
        <ul>
            {posts.map(post => (
                <li key={post.id}>
                    <Link href='products/[productId]' as={`products/${post.id}`}>{post.name}</Link>
                </li>
            ))}
        </ul>
    )
}

// This function gets called at build time
export async function getStaticProps() {
    // Call an external API endpoint to get posts
    // const res = await fetch('https://.../posts')
    // const posts = await res.json()

    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            posts: [
                { id: 1, name: 'one' },
                { id: 2, name: 'two' },
                { id: 3, name: 'three' },
            ],
        },
    }
}

export default About