import React, { createContext, useState } from 'react';
import { useRouter } from 'next/router'
export const ProductContext = createContext();
const ProductContextProvider = (props) => {
    const [productsList, setProductsList] = useState([]);
    const [product, setProduct] = useState({id: 'test'});
    const [category, setCategory] = useState({id: 'test'});
    const [title, setTitle] = useState('Happy Shopping');
    
    return (
        <ProductContext.Provider value={{ product, setProduct, category, setCategory, title, setTitle }}>
            {props.children}
        </ProductContext.Provider>
    )
}
export default ProductContextProvider;