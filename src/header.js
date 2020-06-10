import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import AddLocation from './addLocation';
export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openAddLocationModal: false
        }
    }
    handleOpenAddLocationModal = () => {
        this.setState({
            openAddLocationModal: true
        })
    }
    handleCloseAddLocationModal = () => {
        this.setState({
            openAddLocationModal: false
        })
    }
    render() {
        return (
            <nav className="navbar navbar-expand-nd navbar-light bg-light">


                {this.state.openAddLocationModal ? <AddLocation handleLocationsRefresh={this.props.handleLocationsRefresh} db={this.props.db} openAddLocationModal={this.state.openAddLocationModal} handleCloseAddLocationModal={this.handleCloseAddLocationModal} /> : null}

                <a className="navbar-brand c-primary" href="/">Locations</a>
                <span class="ml-auto navbar-text">
                    <Button onClick={this.handleOpenAddLocationModal} startIcon={<AddIcon />} variant="contained" className="rounded-btn" color="primary">
                        Add Locations
                        </Button>
                </span>


            </nav>
        )
    }
}
