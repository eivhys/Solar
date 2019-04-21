import React from 'react'
import Layout from '../Layout'

class LayoutRoute extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        const comp = this.props.component
        return (
            <Layout>
                {comp}
            </Layout>
        )
    }
}

export default (LayoutRoute)