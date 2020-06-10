import React, { Component } from 'react'
import MaterialTable from 'material-table'
import AddLocation from './addLocation';
import { showInfoMsg, showSuccessMsg, showErrorMsg } from './uiComponents/alertMsgs';
export default class LocationsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openAddLocationModal: false,
            record: null
        }
    }

    handleCloseAddLocationModal = () => {
        this.setState({
            openAddLocationModal: false
        })
    }
    handleDelete = (event, rowData) => {
        event.preventDefault();
        showInfoMsg('Are you sure to delete this location?', () => this.handleDeleteConfirm(rowData))

    }
    handleDeleteConfirm = (record) => {
        let db = this.props.db;
        let key = record.key;
        let request = db.transaction('locations', "readwrite")
            .objectStore("locations")
            .delete(key);
        request.onsuccess = (event) => {
            // It's gone!
            showSuccessMsg('Location deleted successfuly');
            this.props.handleLocationsRefresh();

        };
        request.onerror = (event) => {
            // console.log('error while deleting');
            showErrorMsg('Failed to delete location');
            this.props.handleLocationsRefresh();
        };
    }
    handleEdit = (event, rowData) => {
        this.setState({
            record: rowData,
            openAddLocationModal: true

        })
    }
    render() {

        return (
            <>
                {this.state.openAddLocationModal ? <AddLocation handleLocationsRefresh={this.props.handleLocationsRefresh} record={this.state.record} db={this.props.db} openAddLocationModal={this.state.openAddLocationModal} handleCloseAddLocationModal={this.handleCloseAddLocationModal} /> : null}
                <MaterialTable
                    columns={[
                        { title: 'Location Name', field: 'locationName' },
                        { title: 'Address', field: 'addressLine1' },
                        { title: 'Phone Number', field: 'phoneNumber' },

                    ]}
                    data={this.props.locationsList || []}
                   
                    actions={[
                        {
                            icon: 'edit',
                            tooltip: 'Edit Location',
                            onClick: this.handleEdit
                        },
                        {
                            icon: 'delete',
                            tooltip: 'Delete Location',
                            onClick: this.handleDelete
                        }
                    ]}
                    options={{
                        rowStyle: {
                            margin: '10px'
                        },
                        actionsColumnIndex: -1,
                        search: false,
                        draggable: false,
                        showTitle:false

                    }}

                />
            </>
        )
    }
}
