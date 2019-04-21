import React from 'react'
import { Box, Grid, Grommet, grommet } from 'grommet'
import Sidebar from './Sidebar';
import MusicControl from './MusicControl';

function Layout(props) {
    return (
        <Grommet theme={grommet} full style={{ overflowX: 'hidden' }}>
            <Grid fill rows={["auto", "flex", "auto"]}>
                <div>
                    <Box tag="header" background="dark-1" pad="small">
                        Solar
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