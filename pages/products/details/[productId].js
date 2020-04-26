import fetch from 'node-fetch'
import React, { useState, useEffect, useContext } from 'react';
import { ProductContext } from "../../../product-context";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';
import Button from "components/CustomButtons/Button.js";
import classNames from "classnames";
import "./details.scss";

function Product({ params: propProduct, query }) {
    const { setTitle } = useContext(ProductContext);
    console.log("kbt: Product -> propProduct", propProduct);
    console.log("kbt: Product -> query", query);
    let product = query.product ? JSON.parse(query.product) : {};
    let imagePlaceholderUrl = 'https://www.ajactraining.org/wp-content/uploads/2019/09/image-placeholder-600x600.jpg';
    useEffect(() => {
        // Update the document title using the browser API

        console.log("kbt:fromIndex About -> process.env", process.env.TEST);
        setTitle(product && product.id);
    });
    return (
        <div className="page-container details-page">
            <div className="product-container">
                <img src={imagePlaceholderUrl} alt="product-image" />
                <div className="product-details">
                    <div className="title">{product.title}</div>
                    <div className="brand">{product.brand}</div>
                    <div className="description">{product.description}</div>
                    <div className="price">
                        <div className="actual-price">₹ {product.price}</div>
                        {!!product.strikePrice && <div className="strike-price">₹ {product.strikePrice}</div>}
                    </div>
                    <div className="buy-action">
                        <Button color="success" startIcon={<WhatsAppIcon />}>Buy via Whatsapp</Button>
                        <Button color="facebook" startIcon={<FacebookIcon />}>Buy via Facebook</Button>
                    </div>
                    <div className="icons">
                        <div className={classNames('cod', { available: product.codAvailable })}>
                            {product.codAvailable ? <CheckCircleIcon /> : <CancelIcon />}<span title="Cash on delivery">COD</span>
                        </div>
                        <div className={classNames('return', { available: product.returnAvailable })}>
                        {product.returnAvailable ? <CheckCircleIcon /> : <CancelIcon />}<span title="Return Product">Return</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* <h2>Product Information</h2>
            <ul>
                <li key={product.name}>{product.title}</li>
                <li key={product.price}>{product.price}</li>
                <li key={product.inStock}>{product.inStock ? 'Yes' : 'No'}</li>
            </ul> */}
        </div>
    )
}

// // This function gets called at build time
export async function getServerSideProps(arg) {
    const { params, query, req } = arg;
    console.log("kbt: ==================getServerSideProps -> query", JSON.stringify(query));
    console.log("kbt: getStaticProps -> params", JSON.stringify(params));
    console.log("kbt: getStaticProps -> params", req.url);
    // Call an external API endpoint to get posts
    // const res = await fetch(`https://us-central1-eeradi.cloudfunctions.net/api/products/${params.productId}`)
    // const product = await res.json()

    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            params, query
        },
    }
}

export default Product