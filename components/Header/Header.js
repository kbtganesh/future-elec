import React, { useContext } from "react";
import Router, { withRouter } from 'next/router'
import Link from "next/link";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import TextField from '@material-ui/core/TextField';
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
import SearchIcon from '@material-ui/icons/Search';
// core components
import styles from "assets/jss/nextjs-material-kit/components/headerStyle.js";
import { ProductContext } from "../../product-context";
import { BASE_URL } from "helper";
import InputAdornment from "@material-ui/core/InputAdornment";
import StorefrontIcon from '@material-ui/icons/Storefront';

const useStyles = makeStyles(styles);
const useStyles1 = makeStyles((theme) => ({
  root: {
    '& .MuiFormLabel-root, & .MuiButton-root, & .MuiInputBase-input': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottom: '2px solid white',
    },
  },
}));
function Header(props) {
  const { setCategories, setChildCategories } = useContext(ProductContext);
  const classes = useStyles();
  const classes1 = useStyles1();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchKey, setSearchKey] = React.useState('');
  const [searchBox, setSearchBox] = React.useState(false);
  React.useEffect(() => {
    if (props.changeColorOnScroll) {
      window.addEventListener("scroll", headerColorChange);
    }
    return function cleanup() {
      if (props.changeColorOnScroll) {
        window.removeEventListener("scroll", headerColorChange);
      }
    };
  });
  React.useEffect(() => {
    (async function fetchData() {
      if (setCategories) {
        console.log("kbt: fetchData -> setCategories", setCategories);
        let categoriesResponse = await fetch(`${BASE_URL}/products/categories`);
        let categories = await categoriesResponse.json();
        console.log("kbt: Header -> useEffect", categories);
        if (categories.data)
          setCategories(categories.data);
        setChildCategories(prepareChildCategories(categories.data));
      }
    })();
    function prepareChildCategories(categories = []) {
      return categories.reduce && categories.reduce((a, v) => {
        if (v.child)
          v.child.forEach(d => {
            if (d.child) a[d.key] = d.child;
          });
        return a;
      }, {});
    }
  }, [setCategories])
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const headerColorChange = () => {
    const { color, changeColorOnScroll } = props;
    const windowsScrollTop = window.pageYOffset;
    if (windowsScrollTop > changeColorOnScroll.height) {
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[changeColorOnScroll.color]);
    } else {
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[changeColorOnScroll.color]);
    }
  };
  const { color, rightLinks: RightLinks, leftLinks, brand, fixed, absolute } = props;
  const appBarClasses = classNames({
    [classes.appBar]: true,
    [classes[color]]: color,
    [classes.absolute]: absolute,
    [classes.fixed]: fixed
  });
  const brandComponent = (
    <Link href="/" as="/">
      <Button className={classes.title}>{brand}</Button>
    </Link>
  );
  function search() {
    Router.push(`/products/search/[searchKey]`, `/products/search/${searchKey}`);
  }

  function toggleSearchBox() {
    setSearchBox(s => !s);
  }
  return (
    <AppBar className={appBarClasses}>
      <Toolbar className={classes.container}>
        {leftLinks !== undefined ? brandComponent : null}
        <div className={classes.flex}>
          {leftLinks !== undefined ? (
            <Hidden smDown implementation="css">
              {leftLinks}
            </Hidden>
          ) : (
              <>
                <Hidden smDown implementation="css">
                  {brandComponent}
                </Hidden>
                <Hidden mdUp>
                  <StorefrontIcon />
                </Hidden>
              </>
            )}
        </div>
        {!searchBox && <div className={classes1.root}> <Button
          color="white"
          className={classes.navLink}
          onClick={() => toggleSearchBox()}
        >
          <i className={classes.socialIcons + " fas fa-search"} />
        </Button></div>}
        {searchBox && <div className={classes1.root}>
          <TextField  placeholder="Search" value={searchKey} onChange={(e) => setSearchKey(e.target.value)}
            onKeyPress={event => event.key === 'Enter' && search()} 
            endAdornment={
              <InputAdornment position="end">
                  <SearchIcon />
              </InputAdornment>
            }/>
        </div>}
        <Hidden smDown implementation="css">
          <RightLinks handleDrawerToggle={handleDrawerToggle} />
        </Hidden>
        <Hidden mdUp>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
      <Hidden mdUp implementation="js">
        <Drawer
          variant="temporary"
          anchor={"right"}
          open={mobileOpen}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={handleDrawerToggle}
        >
          <div className={classes.appResponsive} style={{ color: 'white !important' }}>
            {leftLinks}
            <RightLinks handleDrawerToggle={handleDrawerToggle} categories={props.categories} />
          </div>
        </Drawer>
      </Hidden>
    </AppBar>
  );
}

Header.defaultProp = {
  color: "white"
};

Header.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "transparent",
    "white",
    "rose",
    "dark"
  ]),
  rightLinks: PropTypes.any,
  leftLinks: PropTypes.node,
  brand: PropTypes.string,
  fixed: PropTypes.bool,
  absolute: PropTypes.bool,
  // this will cause the sidebar to change the color from
  // props.color (see above) to changeColorOnScroll.color
  // when the window.pageYOffset is heigher or equal to
  // changeColorOnScroll.height and then when it is smaller than
  // changeColorOnScroll.height change it back to
  // props.color (see above)
  changeColorOnScroll: PropTypes.shape({
    height: PropTypes.number.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "info",
      "success",
      "warning",
      "danger",
      "transparent",
      "white",
      "rose",
      "dark"
    ]).isRequired
  })
};

export default withRouter(Header);
