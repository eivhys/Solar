import React from 'react'
import { Box, Grid, Grommet, grommet, Heading, DropButton, Button } from 'grommet'
import { User } from 'grommet-icons'
import Sidebar from './Sidebar';
import MusicControl from './MusicControl';
import logo from '../media/logo.png'
import firebase from 'firebase'

const capitalizeName = (s) => {
    const words = s.split(" ")
    return words.map(n => n.charAt(0).toUpperCase() + n.slice(1, n.length)).join(" ")
}

function Layout(props) {
    return (
        <Grommet theme={grommet} full style={{ overflowX: 'hidden' }}>
            <Grid fill rows={["auto", "flex", "auto"]}>
                <div style={{}}>
                    <Box tag="header" background="dark-1" pad="small" style={{ borderBottom: '1px solid #6FFFB0', display: 'list-item' }}>
                        <img style={{ width: 20, float: 'left' }} src={logo} alt="" />
                        <DropButton
                            style={{ padding: 0, float: 'right' }}
                            icon={<User />}
                            dropAlign={{ top: 'bottom', right: 'right' }}
                            dropContent={<Box pad="large" background="light-2">
                                <Heading style={{ float: 'right', marginRight: 10, marginTop: 2 }}>{capitalizeName(firebase.auth().currentUser.displayName)}</Heading>
                                <Button color="accent-1" label="Sign out" onClick={() => firebase.auth().signOut()} />
                            </Box>} />
                    </Box>
                </div>
                <Box direction="row">
                    <Box width="medium" background="dark-1" overflow="auto" >
                        <div style={{ height: '100%' }}>
                            <Sidebar />
                        </div>
                    </Box>
                    <Box overflow="auto" width="full" background="dark-1" style={{ backgroundColor: '#444' }} >
                        {props.children}
                    </Box>
                </Box>
                <Box tag="footer" pad="small" background="dark-1">
                    <MusicControl />
                </Box>
            </Grid>
        </Grommet>

    )
}

export default (Layout)