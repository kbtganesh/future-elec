import fetch from 'node-fetch'
import React, { useState, useEffect, useContext } from 'react';
import Router, { withRouter } from 'next/router'
import { ProductContext } from "../../../product-context";
import "./list.scss";
import Snackbar from '@material-ui/core/Snackbar';

function List({ response }) {
    let { success, data, errorMessage } = response || {};

    console.log("kbt:fromIndex List -> response", response);
    const { product, setProduct, category, setTitle } = useContext(ProductContext);
    const [count, setCount] = useState(0);
    const [parent, setParent] = useState();
    const [child, setChild] = useState();

    useEffect(() => {
        // Update the document title using the browser API
        
        console.log("kbt:fromIndex About -> process.env", process.env.TEST);
        setTitle(category.label);
        console.log("kbt:fromIndex List -> category", category);
    });
    // async function fetchData() {
    //     const res = await fetch('https://us-central1-eeradi.cloudfunctions.net/api/products')
    //     setData(await res.json());
    // }

    function selectProduct(product) {
        console.log("kbt: selectProduct -> sproduct", JSON.stringify(product));
        setProduct(product);
        let productObject = JSON.parse(JSON.stringify(product));
        let {imgUrl, ...productObjectCopy} = productObject;
        let encodedProduct = encodeURIComponent(JSON.stringify(productObjectCopy));
        console.log("kbt: selectProduct -> imgUrl", imgUrl);
        let encodedImgUrl = encodeURIComponent(imgUrl);
        console.log("kbt: selectProduct -> encodedImgUrl", encodedImgUrl);
        let queryParam = `product=${encodedProduct}${imgUrl ? `&imgUrl=${encodedImgUrl}` : ''}`
        Router.push(`/products/details/[productId]?${queryParam}`, `/products/details/${product.id}?${queryParam}`);
    }

    function selectChildCategory(childKey) {
        setChild(childKey);
    }

    return (
        <div className="page-container">
            <Snackbar open={!!errorMessage} autoHideDuration={6000} message={errorMessage}>
            </Snackbar>
            {!!errorMessage && <h1 style={{ textAlign: 'center' }}>
                {errorMessage}
            </h1>}
            {data && <div className="product-card-container">
                {data.map(d => (
                    <div className={"product-card"} onClick={() => selectProduct(d)}>
                        <img src={d.imgUrl || require('./no-image.png')} />
                        <div className="info">
                            <div className="title">{d.title}</div>
                            <div className="brand">{d.brand}</div>
                            <div className="price">
                                <div className="actual-price">₹{d.price}</div>
                                {!!d.strikePrice && <div className="strike-price">₹ {d.strike}</div>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>}
            {/* <div className="child-category">
                {parent && childCategories[parent].map((c, i) => (
                    <Grow in={true} timeout={(i+1)*250}>
                        <div className="item" onClick={() => selectChildCategory(c.key)}>{c.label}</div>
                    </Grow>
                ))}
            </div> */}
        </div>
    )
}

export async function getServerSideProps({ params }) {
    console.log("kbt: getServerSideProps -> param", params);
    let { categoryKey } = params;
    console.log("kbt:fromIndexfromindex getServerSideProps -> categoryKey", categoryKey);
    // Call an external API endpoint to get posts
    let response = {};
    try {
        const res = await fetch('https://us-central1-eeradi.cloudfunctions.net/api/products/category/' + categoryKey)
        response = await res.json();
    } catch (e) {
        response.errorMessage = e || 'Unknown Error Occured';
    }

    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            response
        },
    }
}

export default withRouter(List)