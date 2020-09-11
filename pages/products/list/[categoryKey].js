import fetch from 'node-fetch'
import React, { useState, useEffect, useContext } from 'react';
import Router, { withRouter } from 'next/router'
import { ProductContext } from "../../../product-context";
import "./list.scss";
import Snackbar from '@material-ui/core/Snackbar';

function List({ response, params, query }) {
    console.log("kbt: List -> query", query);
    console.log("kbt: List -> params", params);
    let { success, data, errorMessage } = response || {};
    let { categoryKey } = params;
    console.log("kbt: List -> categoryKey", categoryKey);
    const { product, setProduct, category, setTitle, childCategories } = useContext(ProductContext);
    console.log("kbt: List -> childCategories", childCategories);
    const [count, setCount] = useState(0);
    const [parent, setParent] = useState();
    console.log("kbt: List -> childCategories[categoryKey]", childCategories[categoryKey]);
    const [child, setChild] = useState(query && query.child || '');
    console.log("kbt: List -> child", child);

    useEffect(() => {
        setTitle(category.label);
    }, []);

    useEffect(() => {
        hideLoader();
        setChild(query && query.child || '');
    }, [query]);
    // async function fetchData() {
    //     const res = await fetch('https://us-central1-eeradi.cloudfunctions.net/api/products')
    //     setData(await res.json());
    // }

    function selectProduct(product) {
        console.log("kbt: selectProduct -> sproduct", JSON.stringify(product));
        setProduct(product);
        // let productObject = JSON.parse(JSON.stringify(product));
        // let {imgUrl, ...productObjectCopy} = productObject;
        // let encodedProduct = encodeURIComponent(JSON.stringify(productObjectCopy));
        // console.log("kbt: selectProduct -> imgUrl", imgUrl);
        // let encodedImgUrl = encodeURIComponent(imgUrl);
        // console.log("kbt: selectProduct -> encodedImgUrl", encodedImgUrl);
        // let queryParam = `product=${encodedProduct}${imgUrl ? `&imgUrl=${encodedImgUrl}` : ''}`
        // Router.push(`/products/details/[productId]?${queryParam}`, `/products/details/${product.id}?${queryParam}`);
        Router.push(`/products/details/[productId]`, `/products/details/${product.id}`);
    }

    function showLoader() {
        let elem = document.getElementById('linear-loader');
        console.log("kbt: showLoader -> elem", elem);
        elem.classList.add("show");
    }

    function hideLoader() {
        let elem = document.getElementById('linear-loader');
        elem.classList.remove("show");
    }

    function selectChildCategory(childKey) {
        setChild(childKey);
    }

    function onClickChildCategory(child) {
        setChild(child);
        showLoader();
        Router.push(`/products/list/[categoryKey]?child=${child}`, `/products/list/${categoryKey}?child=${child}`)
            .then(_ => window.scrollTo(0, 0));
    }
    const childCategoryList = childCategories && childCategories[categoryKey] || [];
    return (
        <div className="page-container">
            <Snackbar open={!!errorMessage} autoHideDuration={4000} message={errorMessage}>
            </Snackbar>
            {childCategoryList && childCategoryList.length > 0 && <div className="filterByChildCategory">
                <div className={`childCategory ${child == 'all' ? 'selected' : ''}`} onClick={() => onClickChildCategory('all')}>All</div>
                {childCategoryList.map(c => (
                    <div className={`childCategory ${child == c.key ? 'selected' : ''}`} key={c.key} onClick={() => onClickChildCategory(c.key)}>
                        {c['label']}
                    </div>)
                )}
            </div>}
            {!!errorMessage && <h1 style={{ textAlign: 'center' }}>
                {errorMessage}
            </h1>}
            {data && <div className="product-card-container">
                {data.map(d => {
                    let percentageOffer;
                    if (d.strikePrice && d.price)
                        percentageOffer = (d.strikePrice - d.price) * 100 / d.strikePrice;
                    return (
                        <div key={d.id} className={"product-card"} onClick={() => selectProduct(d)}>
                            <img src={(d.imgUrlList && d.imgUrlList[0]) || require('public/images/noImage.png')} />
                            <div className="info">
                                <div className="title">{d.title}</div>
                                <div className="brand">{d.brand}</div>
                                <div className="price">
                                    <div className="actual-price">₹{d.price}</div>
                                    {!!d.strikePrice && <div className="strike-price">₹ {d.strikePrice}</div>}
                                    {!!percentageOffer &&
                                        <div className="percentageOffer">
                                            {Math.round(percentageOffer)}% off
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    )
                })}
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

export async function getServerSideProps({ params, query }) {
    console.log("kbt: getServerSideProps -> param", params);
    let { categoryKey } = params;
    let child = query && query.child || '';
    let queryParam = child && child != 'all' ? '?child=' + child : '';
    console.log("kbt:fromIndexfromindex getServerSideProps -> categoryKey", categoryKey);
    // Call an external API endpoint to get posts
    let response = {};
    try {
        console.log("***********")
        console.log("URL", 'https://us-central1-eeradi.cloudfunctions.net/api/products/category/' + categoryKey + queryParam);
        const res = await fetch('https://us-central1-eeradi.cloudfunctions.net/api/products/category/' + categoryKey + queryParam)
        response = await res.json();
    } catch (e) {
        response.errorMessage = e.errorMessage || 'Unknown Error Occured';
    }

    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            response, params, query
        },
    }
}

export default withRouter(List)