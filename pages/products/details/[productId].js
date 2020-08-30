import fetch from 'node-fetch'
import React, { useState, useEffect, useContext } from 'react';
import { ProductContext } from "../../../product-context";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import Tooltip from "@material-ui/core/Tooltip";
import FacebookIcon from '@material-ui/icons/Facebook';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import Button from "components/CustomButtons/Button.js";
import Carousel from 'react-bootstrap/Carousel'
import classNames from "classnames";
import "./details.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
const sampleImage = [
    "https://www.freeiconspng.com/uploads/square-png-31.png",
    "https://homepages.cae.wisc.edu/~ece533/images/arctichare.png",
    "https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
    "https://homepages.cae.wisc.edu/~ece533/images/baboon.png",
    "https://homepages.cae.wisc.edu/~ece533/images/fruits.png",
]
const imagePlaceholderUrl = 'https://www.ajactraining.org/wp-content/uploads/2019/09/image-placeholder-600x600.jpg';

function Product({ product: productRes, query }) {
    const { setTitle } = useContext(ProductContext);
    let productResData = productRes.success ? { ...productRes.data } : {};
    const [product, setProduct] = useState(productResData);
    const [carouselIndex, setCarouselIndex] = useState(0);
    let subProducts = productResData.subProducts ? { ...productResData.subProducts } : null;
    useEffect(() => {
        // Update the document title using the browser API

        console.log("kbt: Normal -> useEffect");
        setTitle(product && product.id);
    });
    function changeDisplayProduct(isSubProduct, id) {
        console.log("kbt: changeDisplayProduct -> isSubProduct, id", isSubProduct, id);
        let product;
        if (!isSubProduct) {
            product = { ...productRes.data }
        } else {
            product = { ...subProducts[id] }
        }
        window.scrollTo(0, 0);
        setCarouselIndex(0);
        setProduct(product)
    }

    function renderSubProduct() {
        let idArr = [];
        if (productRes?.data?.subProducts) {
            idArr = [productRes.data.id, Object.keys(productRes.data.subProducts)]
        }
        return idArr.map((id, i) => {
            let currentProject = i == 0 ? productResData : subProducts[id];
            let imgUrlFirst = currentProject.imgUrlList ? currentProject.imgUrlList[0] : imagePlaceholderUrl;
            return (
                <div className={`sub-product-item ${product.id == currentProject.id ? 'selected' : ''}`}
                    onClick={() => changeDisplayProduct(i != 0, currentProject.id)}>
                    <div className="image">
                        <img src={imgUrlFirst} alt={currentProject.id} />
                    </div>
                    <div className="text">
                        <div className="title">
                            {currentProject.title}
                        </div>
                        <div className="price">
                            ₹ {currentProject.price}
                        </div>
                    </div>
                </div>
            )
        })
    }

    function onCarouselSelect(i, a, b) {
        console.log("kbt: onCarouselSelect -> i,a,b", i, a, b);
        setCarouselIndex(i);
    }

    let percentageOffer;
    if (product.strikePrice && product.price)
        percentageOffer = (product.strikePrice - product.price) * 100 / product.strikePrice;
    let errorMessage = (productRes && productRes.errorMessage) ? productRes.errorMessage : '';
    return (
        <div className="page-container details-page">
            {!!errorMessage && <h1 style={{ textAlign: 'center' }}>
                {errorMessage}
            </h1>}
            {product && product.id && <div className="product-container">
                <RenderImage {...{ product, onCarouselSelect, carouselIndex }} />
                {/* <img src={product.imgUrl || imagePlaceholderUrl} alt="product-image" /> */}
                <div className="product-details">
                    <div className="title">{product.title}</div>
                    <div className="brand">{product.brand}</div>
                    <div className="description">{product.description}</div>
                    <div className="price">
                        <div className="actual-price">₹ {product.price}</div>
                        {!!product.strikePrice && <div className="strike-price">₹ {product.strikePrice}</div>}
                        {!!percentageOffer &&
                            <div className="percentageOffer">
                                {Math.round(percentageOffer)}% off
                        </div>
                        }
                    </div>
                    {product.shippingPrice && <div className="shippingPrice">
                        <span className="title">Delivery</span>
                        <div className="price">
                            ₹ {product.shippingPrice}
                        </div>
                    </div>}
                    <div className="buy-action">
                        <a id="whatsapp-link" target="_blank" href={`https://api.whatsapp.com/send?phone=919566992686&text=Hi, I want to buy ${product.title} - ${product.id}`}>
                            <Button htmlFor="whatsapp-link" color="success" startIcon={<WhatsAppIcon />}>
                                Buy via Whatsapp
                            </Button>
                        </a>
                        <a id="facebook-link" target="_blank" href={`https://m.me/arun21031991?ref=Hi, I want to buy ${product.title} - ${product.id}`}>
                            <Button htmlFor="facebook-link" color="facebook" startIcon={<FacebookIcon />}>
                                Buy via Facebook
                            </Button>
                        </a>
                    </div>
                    <div className="icons">
                        <Tooltip title={`${product.codAvailable ? 'COD Available' : 'COD Not Available'}`}>
                            <div className={classNames('cod', { available: product.codAvailable })}>
                                {product.codAvailable ? <CheckCircleIcon /> : <CancelIcon />}<span title="Cash on delivery">COD</span>
                            </div>
                        </Tooltip>
                        <Tooltip title={`${product.returnAvailable ? 'Return Available' : 'Return Not Available'}`}>
                            <div className={classNames('return', { available: product.returnAvailable })}>
                                {product.returnAvailable ? <CheckCircleIcon /> : <CancelIcon />}<span title="Return Product">Return</span>
                            </div>
                        </Tooltip>
                    </div>
                </div>
            </div>}
            {subProducts && <div className="sub-product-container">
                <div className="heading">
                    Other Varients
                </div>
                <div className="list">
                    {renderSubProduct()}
                </div>
            </div>}
            {/* <h2>Product Information</h2>
            <ul>
                <li key={product.name}>{product.title}</li>
                <li key={product.price}>{product.price}</li>
                <li key={product.inStock}>{product.inStock ? 'Yes' : 'No'}</li>
            </ul> */}
        </div>
    )
}

function RenderImage({ product, onCarouselSelect, carouselIndex }) {
    console.log("kbt: RenderImage -> product", product.id);
    console.log("kbt: RenderImage -> carouselIndex", carouselIndex);
    let imgUrlList = product.imgUrlList ? product.imgUrlList.filter(url => !!url) : [imagePlaceholderUrl];
    return (
        <Carousel activeIndex={carouselIndex} onSelect={onCarouselSelect} className="img-carousel">
            {imgUrlList.map((imgUrl, i) => (
                <Carousel.Item key={i}>
                    <img
                        src={imgUrl || imagePlaceholderUrl}
                        alt={`${product.id} - Image ${i + 1}`}
                    />
                </Carousel.Item>
            ))}
        </Carousel>
    )
}

// // This function gets called at build time
export async function getServerSideProps(arg) {
    const { params, query, req } = arg;
    // if (query.product) {
    //     console.log('OTHA'.repeat('10'));
    //     console.log("kbt: getServerSideProps -> query.product", query.product.length);
    //     console.log('OTHA'.repeat('10'));
    //     product = JSON.parse(decodeURIComponent(query.product));
    //     console.log("kbt: getServerSideProps -> product", product);
    //     console.log("kbt: getServerSideProps -> query.imgUrl", query.imgUrl);
    //     console.log("kbt: getServerSideProps -> query.imgUrl", query.imgUrl);
    //     console.log("kbt: getServerSideProps -> decodeURIComponent(query.imgUrl)", decodeURIComponent(query.imgUrl));
    //     if (query.imgUrl) product['imgUrl'] = query.imgUrl;
    // } else {
    //     product = null;
    // }
    // Call an external API endpoint to get posts
    let product = {};
    try {
        const res = await fetch(`https://us-central1-eeradi.cloudfunctions.net/api/products/detail/${params.productId}`)
        product = await res.json()
    } catch (error) {
        product.errorMessage = error && error.errorMessage || 'Unknown Error Occured';
    }

    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            params, product
        },
    }
}

export default Product