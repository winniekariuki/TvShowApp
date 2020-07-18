import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useApolloClient } from "@apollo/react-hooks";
import SingleTVShow from "../../pages/tvShowDetails";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import WatchLaterIcon from '@material-ui/icons/WatchLater';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));
const SEARCH_TV_SHOW_BY_NAME = gql`
  query searchTvShowByName($name: String!) {
    searchTvShowByName(name: $name) {
      tvshows {
        name
        language
        image
        season
        episode
        duration
        rating
        url
        summary
        id
      }
    }
  }
`;

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");
  const [search, setSearch] = useState("");
  const { data, error } = useQuery(SEARCH_TV_SHOW_BY_NAME, {
    variables: { name: search },
  });
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const onSearchHandler = (e) => {
    setSearch(e.target.value);
  };

  const onClickTvShowHandler = (id) => {
    setShowModal(!showModal)
    setId(id)
  }
  const client = useApolloClient();

  const logoutHandler = (e) => {
    e.preventDefault();
    client.writeData({ data: { isLoggedIn: false } });
    localStorage.clear(); // remove data on user's browser storage
  };
  if (error) return <p>Error Occurred, Try again</p>;

  return (
    <Fragment>
       <div className={classes.grow}>
    <AppBar position="static">
      <Toolbar>
      <div className="menuWrapper"> <Link to="/home">TV Show</Link> &nbsp;&nbsp;</div>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search TV Show By Name"
            onChange={onSearchHandler}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>
        <div className={classes.grow} />
        <div className={classes.sectionDesktop}>
      
          <div className="menuWrapper">
            {/* menu items */}
            <Link to="/schedule">< WatchLaterIcon/></Link> &nbsp;&nbsp;
        {localStorage.getItem("token") && (
        <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={logoutHandler}
            color="inherit"
          >
        <ExitToAppIcon/>
          </IconButton>
            )}
          </div>
     

        </div>
        <div className={classes.sectionMobile}>
          <IconButton
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
    {renderMobileMenu}
    {renderMenu}
  </div>
  <div>
      {data && data.searchTvShowByName.tvshows.length > 0 && <hr />}

      {/* search data */}
      {data && data.searchTvShowByName.tvshows.length > 0 && (
        <div className="searchDataWrapper">
          {data.searchTvShowByName.tvshows.map((searchedData) => {
            return (
              <div className="singleSearchData">
                <center>
                  <h3 onClick={() => onClickTvShowHandler(searchedData.id)}>{searchedData.name}</h3>
                  <img
                    src={searchedData.image && searchedData.image}
                    alt="TV Show"
                    height="130"
                    width="120"
                  />
                </center>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>
                    {searchedData.rating && `Rating: ${searchedData.rating}`}
                  </p>
                  <p>{searchedData.Language && `${searchedData.Language}`}</p>
                  <p>{searchedData.season && searchedData.season}</p>
                </div>

                <hr />
                {/* tv show summary */}
                {searchedData.summary && (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: searchedData.summary.substr(0, 60).concat("..."),
                    }}
                  ></p>
                )}
              </div>
            );
          })}


          {/* display single TV show on click */}
          {showModal && (
            <div
              id="myModal"
              className={
                showModal ? `modal display-block` : `modal display-none`
              }
            >
              <div className="modal-content">
                <span
                  className="close closeModalBtn"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </span>
                <SingleTVShow id={id} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </Fragment>
   
  );
};

export default Header;