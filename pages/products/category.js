import Link from 'next/link'
import fetch from 'node-fetch'
import React, { useState, useEffect, useContext } from 'react';
import Router, { withRouter } from 'next/router'
import HeaderLinks from "components/Header/HeaderLinks.js";
import { ProductContext } from "../../product-context";
import "./products.scss";
import Grow from '@material-ui/core/Grow';
import { BASE_URL } from "helper";

function Category({ categories }) {
    const { product, setProduct, setTitle, setCategory } = useContext(ProductContext);
    const parentKeyCategories = categories.reduce((acc, val) => { acc[val.key] = val.child; return acc; }, {})
    const [count, setCount] = useState(0);
    const [parent, setParent] = useState();
    const [child, setChild] = useState();
    const [data, setData] = useState([]);

    useEffect(() => {
        // Update the document title using the browser API

        console.log("kbt: About -> process.env", process.env.TEST);
        setTitle('Choose Category');
    });
    async function fetchData() {
        const res = await fetch(`${BASE_URL}/products`);
        setData(await res.json());
    }

    function selectParentCategory(parentKey) {
        setParent(parentKey);
    }

    function selectChildCategory(childCategory) {
        setCategory(prev => {
            console.log("kbt: selectChildCategory -> prev", prev);
            return childCategory;
        });
        console.log("kbt: selectChildCategory -> childCategory", childCategory);
        setChild(childCategory.key);
        Router.push(`/products/list/[categoryKey]`, `/products/list/${childCategory.key}`);
    }

    return (
        <div className="page-container category-container">
            <div className="parent-category">
                {categories.map(c => (
                    <div className={"item" + (c.key === parent ? " selected" : "")} key={c.key} onClick={() => selectParentCategory(c.key)}>
                        <div className="overlay"></div>
                        <div className="label truncateLongText">{c.label}</div>
                    </div>
                ))}
            </div>
            <div className="child-category">
                {parent && parentKeyCategories[parent].map((c, i) => (
                    <Grow in={true} timeout={(i + 1) * 250}>
                        {/* <Link as={`/products/list/l/${c.key}`} href={`/products/list/listing?categoryKey=${c.key}`}> */}
                        <div className="item"
                            onClick={() => selectChildCategory(c)}
                        >
                            <div className="overlay"></div>
                            <div className="label truncateLongText">{c.label}</div>
                        </div>
                        {/* </Link> */}
                    </Grow>
                ))}
            </div>
        </div>
    )
}

// This function gets called at build time
export async function getServerSideProps() {
    // Call an external API endpoint to get posts
    const res = await fetch(`${BASE_URL}/products/categories`)
    const response = await res.json()

    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            categories: response.data
        },
    }
}

export default Category