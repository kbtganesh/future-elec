/*eslint-disable*/
import React, { useContext, useState } from "react";
import Link from "next/link";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

// @material-ui/icons
import { Apps, CloudDownload } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import Hidden from "@material-ui/core/Hidden";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/nextjs-material-kit/components/headerLinksStyle.js";

import { ProductContext } from "../../product-context";

import "./headerlink.scss";
const useStyles = makeStyles(styles);
console.log('styles', styles);
export default function HeaderLinks({ handleDrawerToggle }) {
  const { categories, setChildCategories } = useContext(ProductContext);
  console.log("kbt: HeaderLinks -> categories", categories);

  const [collapseState, setCollapseState] = React.useState({
    product: false,
    category: false,
  });

  const [expanded, setExpanded] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const classes = useStyles();
  let categoriesObj = React.useMemo(() => prepareChildCategories(categories), [categories]);
  console.log("kbt: HeaderLinks -> categoriesObj", categoriesObj);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  function prepareChildCategories(categories = []) {
    return categories.reduce && categories.reduce((a, v) => {
      if (v.child)
        v.child.forEach(d => {
          if (d.child) a[d.key] = d.child;
        });
      return a;
    }, {});
  }

  function toggleCollapse(item) {
    console.log("kbt: toggleCollapse -> item", item);
    setCollapseState(prev => ({ ...prev, [item]: !prev[item] }));
  }

  return (
    <List className={classes.list}>

      <ListItem className={classes.listItem}>
        <div className={classes.navLink}>
          <Link href="/"><a onClick={handleDrawerToggle}>Home</a></Link>
        </div>
      </ListItem>

      <Hidden smDown implementation="js">
        <ListItem className={classes.listItem}>
          <div className={classes.navLink}
            aria-controls="customized-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            Products
          </div>
          <Menu
            PopoverClasses={{ paper: classes.popoverPaper }}
            id="customized-menu"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'left', horizontal: 'left' }}
            getContentAnchorEl={null}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            disableScrollLock={true}
          >
            <TreeView
              className={classes.treeStyle+' desktopTreeView'}
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              expanded={expanded} onNodeSelect={(e, n) => {
                setExpanded(prev => prev == n ? [] : [n]);
              }}>
              {categories && categories.map && categories.map(c => (
                <TreeItem key={c.key} nodeId={c.key} label={c.label} >
                  {c.child && c.child.map(cc => (
                    <Link key={cc.key} href={`/products/list/[categoryKey]`} as={`/products/list/${cc.key}`}>
                      <a onClick={handleClose}><TreeItem nodeId={cc.key} label={cc.label} /></a>
                    </Link>))}
                </TreeItem>
              ))}
            </TreeView>
          </Menu>
        </ListItem>
      </Hidden>

      <Hidden mdUp implementation="js">
        <ListItem className={classes.listItem}>
          {/* <div className={classes.navLink}>
          <Link href="/products/category"><a onClick={handleDrawerToggle}>Products</a></Link>
          </div> */}
          <TreeView
            className={classes.treeStyle}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            <TreeItem nodeId="1" label="Products" className="parent">
              {categories && categories.map && categories.map(c => (
                <TreeItem key={c.key} nodeId={c.key} label={c.label}>
                  {c.child && c.child.map(cc => (
                    <Link key={cc.key} href={`/products/list/[categoryKey]`} as={`/products/list/${cc.key}`}>
                      <a onClick={handleDrawerToggle}><TreeItem nodeId={cc.key} label={cc.label} /></a>
                    </Link>))}
                </TreeItem>
              ))}
              {/* <TreeItem nodeId="10" label="OSS" />
              <TreeItem nodeId="6" label="Material-UI">
                <TreeItem nodeId="7" label="src">
                  <TreeItem nodeId="8" label="index.js" />
                  <TreeItem nodeId="9" label="tree-view.js" />
                </TreeItem>
              </TreeItem> */}
            </TreeItem>
          </TreeView>
        </ListItem>
      </Hidden>
      {/* <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-twitter"
          title="Follow us on twitter"
          placement={"top"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            href="https://twitter.com/CreativeTim?ref=creativetim"
            target="_blank"
            color="transparent"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-twitter"} />
          </Button>
        </Tooltip>
      </ListItem> */}
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-facebook"
          title="Follow us on facebook"
          placement={"top"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            href="https://www.facebook.com/allinoneworld"
            target="_blank"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-facebook"} />
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-tooltip"
          title="Follow us on instagram"
          placement={"top"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            href="https://www.instagram.com/"
            target="_blank"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-instagram"} />
          </Button>
        </Tooltip>
      </ListItem>
    </List>
  );
}
