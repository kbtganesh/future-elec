import fetch from 'node-fetch'
function Product({ product }) {
    return (
        <div>
            <h2>Product Information</h2>
            <ul>
                <li key={product.name}>Name - {product.name}</li>
                <li key={product.price}>Price - ${product.price}</li>
                <li key={product.inStock}>In-Stock - {product.inStock ? 'Yes' : 'No'}</li>
            </ul>
        </div>
    )
}

// export async function getStaticPaths() {
//     // Call an external API endpoint to get posts
//     const res = await fetch(`https://us-central1-eeradi.cloudfunctions.net/api/products`);
//     const products = await res.json()
//     // Get the paths we want to pre-render based on posts
//     const paths = products.map(product => `/products/${product.id}`)

//     // We'll pre-render only these paths at build time.
//     // { fallback: false } means other routes should 404.
//     return { paths, fallback: false }
// }

// This function gets called at build time
export async function getServerSideProps({ params }) {
    console.log("kbt: getStaticProps -> params", params);
    // Call an external API endpoint to get posts
    const res = await fetch(`https://us-central1-eeradi.cloudfunctions.net/api/products/${params.productId}`)
    const product = await res.json()

    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    console.log("kbt: getStaticProps -> thisData", product);
    return {
        props: {
            product
        },
    }
}

export default Product