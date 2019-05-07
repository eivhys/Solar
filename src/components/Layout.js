import React from 'react'
import { Box, Grid, Grommet, grommet, Heading, DropButton, Button, ResponsiveContext, ThemeContext } from 'grommet'
import { User } from 'grommet-icons'
import Sidebar from './Sidebar';
import MusicControl from './MusicControl';
import logo from '../media/logo.png'
import SideBarButton from './SideBarButton'
import firebase from 'firebase'
import Resizable from 're-resizable';
import { connect } from "react-redux";
import { compose } from 'redux'
import MusicControlMobile from './MusicControlMobile';

const capitalizeName = (s) => {
    const words = s.split(" ")
    return words.map(n => n.charAt(0).toUpperCase() + n.slice(1, n.length)).join(" ")
}


function Layout(props) {
    return (
        <Grommet theme={grommet} full style={{ overflowX: 'hidden' }}>
            <ThemeContext.Extend
                value={{
                    global: {
                        colors: {
                            brand: 'var(--brand)',
                            focus: 'var(--brand)'
                        }
                    },
                    rangeInput: {
                        thumb: {
                            color: 'var(--brand)'
                        }
                    }
                }}
            >
                <ResponsiveContext.Consumer>
                    {
                        (size) => (size !== "small" ?
                            <Grid fill rows={["auto", "flex", "auto"]}>
                                <Box>
                                    <Box tag="header" background="dark-1" pad="small" style={{ borderBottom: '1px solid var(--brand)', display: 'list-item' }}>
                                        <img style={{ width: 20, padding: 0, float: 'left' }} src={logo} alt="" />
                                        <DropButton
                                            style={{ padding: 0, float: 'right' }}
                                            icon={<User />}
                                            dropAlign={{ top: 'bottom', right: 'right' }}
                                            dropContent={<Box pad="large" background="light-2">
                                                <Heading style={{ float: 'right', marginRight: 10, marginTop: 2 }}>{capitalizeName(firebase.auth().currentUser.displayName)}</Heading>
                                                <Button color="brand" label="Sign out" onClick={() => firebase.auth().signOut()} />
                                            </Box>} />
                                    </Box>
                                </Box>
                                <Box direction="row" style={{ backgroundColor: '#444' }}>
                                    <Resizable
                                        style={{ backgroundColor: '#333', overflowX: 'hidden' }}
                                        enable={{ top: false, right: false, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
                                        minWidth={200}
                                        defaultSize={{
                                            width: 400
                                        }}
                                        maxWidth={500}
                                    //maxHeight='100%'
                                    //minHeight='100%'
                                    >
                                        <Box width='large' background="dark-1" >
                                            <Box fill>
                                                <Sidebar />
                                            </Box>
                                        </Box>
                                    </Resizable>
                                    <Box overflow="hidden" fill margin="small" background="dark-1" style={{ backgroundColor: '#444' }} >
                                        {props.children}
                                    </Box>
                                </Box>
                                <Box tag="footer" pad="small" background="dark-1" style={{ borderTop: '1px solid #444' }}>
                                    <MusicControl />
                                </Box>
                            </Grid>
                            :
                            <Grid fill rows={["auto", "flex", "auto"]}>
                                <Box>
                                    <Box tag="header" background="dark-1" pad="small" style={{ borderBottom: '1px solid var(--brand)', display: 'list-item' }}>
                                        <SideBarButton style={{ padding: 0 }} />
                                        <DropButton
                                            style={{ padding: 0, paddingTop: 5, float: 'right' }}
                                            icon={<User />}
                                            dropAlign={{ top: 'bottom', right: 'right' }}
                                            dropContent={<Box pad="large" background="light-2">
                                                <Heading style={{ float: 'right', marginRight: 10, marginTop: 2 }}>{capitalizeName(firebase.auth().currentUser.displayName)}</Heading>
                                                <Button color="brand" label="Sign out" onClick={() => firebase.auth().signOut()} />

                                            </Box>} />
                                        <img style={{ paddingTop: 5, width: 20, marginLeft: 'calc(50% - 40px)' }} src={logo} alt="" />

                                    </Box>
                                </Box>
                                <Box direction="row" style={{ backgroundColor: '#444' }}>
                                    <Box overflow="hidden" fill margin="small" background="dark-1" style={{ backgroundColor: '#444' }} >
                                        {props.children}
                                    </Box>
                                </Box>
                                <Box tag="footer" pad="small" background="dark-1" style={{ borderTop: '1px solid #444' }}>
                                    <MusicControlMobile />
                                </Box>
                            </Grid>
                        )

                    }
                </ResponsiveContext.Consumer>
            </ThemeContext.Extend>
        </Grommet>

    )
}

export default compose(
    connect((state) => ({
        app: state.app
    }))
)(Layout)