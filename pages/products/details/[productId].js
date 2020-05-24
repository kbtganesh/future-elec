import fetch from 'node-fetch'
import React, { useState, useEffect, useContext } from 'react';
import { ProductContext } from "../../../product-context";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import Tooltip from "@material-ui/core/Tooltip";
import FacebookIcon from '@material-ui/icons/Facebook';
import Button from "components/CustomButtons/Button.js";
import classNames from "classnames";
import "./details.scss";

function Product({ product: productRes, query }) {
    const { setTitle } = useContext(ProductContext);
    let productResData = productRes.data || {};
    let productInitialState = productRes.success ? { ...productRes.data } : {};
    const [product, setProduct] = useState(productInitialState);
    let subProducts = productRes.data.subProducts ? { ...productRes.data.subProducts } : null;
    console.log("kbt: Product -> product.imgUrl", product.imgUrl);
    let imagePlaceholderUrl = 'https://www.ajactraining.org/wp-content/uploads/2019/09/image-placeholder-600x600.jpg';
    useEffect(() => {
        // Update the document title using the browser API

        console.log("kbt:fromIndex About -> process.env", process.env.TEST);
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
        setProduct(product)
    }

    function renderSubProduct() {
        let idArr = [];
        if (productRes?.data?.subProducts) {
            idArr = [productRes.data.id, Object.keys(productRes.data.subProducts)]
        }
        return idArr.map((id, i) => {
            let currentProject = i == 0 ? productResData : subProducts[id];
            return (
                <div className={`sub-product-item ${product.id == currentProject.id ? 'selected' : ''}`}
                    onClick={()=>changeDisplayProduct(i != 0, currentProject.id)}>
                    <div className="image">
                        <img src={currentProject.imgUrl} alt={currentProject.id} />
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
    return (
        <div className="page-container details-page">
            <div className="product-container">
                <img src={product.imgUrl || imagePlaceholderUrl} alt="product-image" />
                <div className="product-details">
                    <div className="title">{product.title}</div>
                    <div className="brand">{product.brand}</div>
                    <div className="description">{product.description}</div>
                    <div className="price">
                        <div className="actual-price">₹ {product.price}</div>
                        {!!product.strikePrice && <div className="strike-price">₹ {product.strikePrice}</div>}
                    </div>
                    <div className="buy-action">
                        <Button color="success" startIcon={<WhatsAppIcon />}>
                            <a href={`https://api.whatsapp.com/send?phone=919566992686&text=Hi, I want to buy ${product.title} - ${product.id}`}>Buy via Whatsapp</a>
                        </Button>
                        <Button color="facebook" startIcon={<FacebookIcon />}>
                            <a href={`https://m.me/allinoneworld?ref=Hellow world`}>Buy via Facebook</a>
                        </Button>
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
            </div>
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
    const res = await fetch(`https://us-central1-eeradi.cloudfunctions.net/api/products/detail/${params.productId}`)
    const product = await res.json()

    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            params, product
        },
    }
}

export default Product