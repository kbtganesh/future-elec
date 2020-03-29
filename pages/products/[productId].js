function Product({ posts }) {
    return (
    <div>
        Product - {posts.name}
        {/* <ul>
            {posts.map(post => (
                <li key={post.id}>{post.name}</li>
            ))}
        </ul> */}
    </div>
    )
}

export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    // const res = await fetch('https://.../posts')
    // const posts = await res.json()
  
    let data = [
        { id: 1, name: 'one' },
        { id: 2, name: 'two' },
        { id: 3, name: 'three' },
    ];

    // Get the paths we want to pre-render based on posts
    const paths = data.map(post => `/products/${post.id}`)
  
    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
  }

// This function gets called at build time
export async function getStaticProps({params}) {
    console.log("kbt: getStaticProps -> params", params);
    // Call an external API endpoint to get posts
    // const res = await fetch('https://.../posts')
    // const posts = await res.json()

    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    let data = [
        { id: 1, name: 'one' },
        { id: 2, name: 'two' },
        { id: 3, name: 'three' },
    ];
    let thisData = data.find(d => d.id == params.productId);
    console.log("kbt: getStaticProps -> thisData", thisData);
    return {
        props: {
            posts: thisData,
        },
    }
}

export default Product