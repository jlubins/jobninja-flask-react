import React, {useState, useEffect, Component} from 'react';
import './App.css';
import ReactHtmlParser from 'react-html-parser';
import {createMuiTheme, fade, ThemeProvider, makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Pagination from '@material-ui/lab/Pagination';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';


const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: darkTheme.palette.text.secondary,
    },
    tertiaryHeading: {
        fontSize: theme.typography.pxToRem(13)
    },
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
            width: '20ch',
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
    logo: {
        maxWidth: 130,
    },
}));

function Welcome(props) {

    const classes = useStyles();

    const [data, setData] = useState(0);
    const [totalPageLength, setTotalPageLength] = useState();

    // handles accordion activation/deactivation in list
    const [expanded, setExpanded] = React.useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(20);

    const [searchTerm, setSearchTerm] = React.useState('');


    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        console.log('Page value changed to ' + value);
        let currentIndex = recordsPerPage * (value - 1)
        fetchData(currentIndex);
    }

    // handles accordion expansion
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleSubmit = (e) => {
        console.log('Search Term: ', searchTerm)
        searchDatabase(searchTerm);
    }

    useEffect(() => {

        // grab first 20 records in list
        const json = fetch('http://localhost:5000/load?first=0', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(safeParseJSON)
            .then(json => {
                setData(json);
                console.log(data);
            });

        // calculate number of pages needed to from last record id
        const totalRecordLength = fetch('http://localhost:5000/get_last_entry_id', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(safeParseJSON)
            .then(json => {
                let pageNumber = Math.ceil(json.last_entry_id / recordsPerPage);
                console.log(pageNumber);
                setTotalPageLength(pageNumber);
            });

    }, [])


    const fetchData = (e) => {
        fetch('http://localhost:5000/load?first=' + e, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(safeParseJSON)
            .then(json => {
                setData(json);
                console.log(data);
            });
    }

    async function safeParseJSON(response) {
        const body = await response.text();
        try {
            return JSON.parse(body);
        } catch (err) {
            console.error("Error:", err);
            console.error("Response body:", body);
        }
    }

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

    const searchDatabase = (e) => {
        if (e !== undefined) {
            fetch('http://localhost:5000/search?query=' + e, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
                .then(safeParseJSON)
                .then(json => {
                    setData(json)
                });
        }
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            id={menuId}
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    );


    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="secondary">
                        <MailIcon/>
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton aria-label="show 11 new notifications" color="inherit">
                    <Badge badgeContent={11} color="secondary">
                        <NotificationsIcon/>
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
                    <AccountCircle/>
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    const renderPages = () => {

        if (totalPageLength === undefined) {
            return (
                <>Still loading ..."</>
            );
        }

        return <Pagination count={totalPageLength} page={currentPage} onChange={handlePageChange}
        />
    }


    const renderRecord = () => {

        if (data.record) {
            return data.record.map((record) => {
                return (

                    <Accordion expanded={expanded === record.id} onChange={handleChange(record.id)}>
                        <AccordionSummary
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography className={classes.heading}>{record.firma}</Typography>
                            <Typography className={classes.secondaryHeading}>{record.titel}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography className={classes.tertiaryHeading}>
                                {ReactHtmlParser(record.volltext)}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                )
            });
        } else {
            return ""
        }
    }

    return (
        <div>
            <div className={classes.grow}>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline/>
                    <AppBar position="static" color="default">
                        <Toolbar>
                            <IconButton
                                edge="start"
                                className={classes.menuButton}
                                color="inherit"
                                aria-label="open drawer"
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Typography className={classes.title} variant="h6" noWrap>
                                <img src={require('./logo.png').default} alt="Job Ninja" className={classes.logo}/>
                            </Typography>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon/>
                                </div>
                                <form className={classes.container} onSubmit={handleSubmit}>
                                    <InputBase
                                        placeholder="Search…"
                                        classes={{
                                            root: classes.inputRoot,
                                            input: classes.inputInput,
                                        }}
                                        value={searchTerm}
                                        onInput={e => setSearchTerm(e.target.value)}
                                    />
                                    <Button onClick={() => {
                                        handleSubmit();
                                    }}>Submit</Button>
                                </form>
                            </div>
                            <div className={classes.sectionMobile}>
                            </div>
                        </Toolbar>
                    </AppBar>
                    {renderMobileMenu}
                    {renderMenu}
                    <br></br>
                    <div className={classes.root}>
                        <CssBaseline/>
                        <React.Fragment>
                            <CssBaseline/>
                            <Container maxWidth="md">
                                {renderRecord()}
                                <br></br>
                                {renderPages()}
                            </Container>
                        </React.Fragment>
                    </div>
                </ThemeProvider>
            </div>
        </div>
    );
}

export default Welcome;
