/*!

=========================================================
* NextJS Material Kit v1.0.0 based on Material Kit Free - v2.0.2 (Bootstrap 4.0.0 Final Edition) and Material Kit React v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-kit
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-kit/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";

import PageChange from "components/PageChange/PageChange.js";

import "assets/scss/nextjs-material-kit.scss?v=0.1.0";
import LinearProgress from '@material-ui/core/LinearProgress';
import ProductContextProvider, { ProductContext } from "../product-context";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";

Router.events.on("routeChangeStart", url => {
  console.log(`Loading: ${url}`);
  let elem = document.getElementById('linear-loader');
  elem.classList.add("show");
  // ReactDOM.render(
  //   <PageChange path={url} />,
  //   document.getElementById("page-transition")
  // );
});
Router.events.on("routeChangeComplete", () => {
  let elem = document.getElementById('linear-loader');
  elem.classList.remove("show");
  // ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  // document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
  let elem = document.getElementById('linear-loader');
  elem.classList.remove("show");
  // ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  // document.body.classList.remove("body-page-transition");
});

export default class MyApp extends App {
  componentDidMount() {
    let comment = document.createComment(`

=========================================================
* NextJS Material Kit v1.0.0 based on Material Kit Free - v2.0.2 (Bootstrap 4.0.0 Final Edition) and Material Kit React v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-kit
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-kit/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

`);
    document.insertBefore(comment, document.documentElement);
  }
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }
  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>Happy Shopping</title>
        </Head>
        <ProductContextProvider>
          <ProductContext.Consumer>
            {({ title, categories, setCategories }) => (
            <>
            <Header
              color="primary"
              // routes={dashboardRoutes}
              brand={title || "Happy Shopping"}
              rightLinks={HeaderLinks}
              setCategories={setCategories}
              categories={categories}
              fixed
            />
            <LinearProgress id="linear-loader" />
            </>)}
          </ProductContext.Consumer>
          <div className="kbt">
            <Component {...pageProps} />
          </div>
        </ProductContextProvider>
      </React.Fragment>
    );
  }
}
