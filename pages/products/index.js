import Link from 'next/link'
import fetch from 'node-fetch'
import React, { useState, useEffect } from 'react';

function About({ products }) {
    const [count, setCount] = useState(0);
    const [data, setData] = useState([]);

    useEffect(() => {
        // Update the document title using the browser API
        document.title = `You clicked ${count} timess`;
        console.log("kbt: About -> process.env", process.env.TEST);
    });
    async function fetchData() {
        const res = await fetch('https://us-central1-eeradi.cloudfunctions.net/api/products')
        setData(await res.json());
    }

    return (
        <ul>
            <li>
                <button onClick={() => setCount(count + 1)}> Click me </button>
            </li>
            <li>
                <button onClick={fetchData}> Data </button>
                {data.map((d, i) => (
                    <div key={i}>
                        {d.id} - {d.name}
                    </div>
                ))}
            </li>
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