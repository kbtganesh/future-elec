import Link from 'next/link'
import fetch from 'node-fetch'

function About({ products }) {
    return (
        <ul>
            {products.map(product => (
                <li key={product.id}>
                    <Link href='products/[productId]' as={`products/${product.id}`}>{product.name}</Link>
                </li>
            ))}
        </ul>
    )
}

// This function gets called at build time
export async function getStaticProps() {
    // Call an external API endpoint to get posts
    const res = await fetch('https://us-central1-eeradi.cloudfunctions.net/api/products')
    const products = await res.json()

    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            products
        },
    }
}

export default About