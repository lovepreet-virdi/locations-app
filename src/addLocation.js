import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@material-ui/core';
import { Formik, Field, Form } from 'formik';
import { renderTextField, renderSingleSelect, renderPhoneField } from './uiComponents/formComponents';
import FacilityTimesModal from './facilityTimesModal';
import { showSuccessMsg, showErrorMsg } from './uiComponents/alertMsgs';
const ct = require('countries-and-timezones');

const timezones = ct.getTimezonesForCountry('US');
const UsaStates = require('usa-states').UsaStates;
const validate = (values) => {
    const errors = {};
    if (!values.locationName || !values.locationName.trim().length) {
        errors.locationName = 'This field is required'
    }
    if (!values.addressLine1 || !values.addressLine1.trim().length) {
        errors.addressLine1 = 'This field is required'
    }
    if (!values.suiteNo || !values.suiteNo.trim().length) {
        errors.suiteNo = 'This field is required'
    }
    if (!values.city || !values.city.trim().length) {
        errors.city = 'This field is required'
    }
    if (!values.state) {
        errors.state = 'This field is required'
    }
    if (!values.zipCode || !values.zipCode.trim().length) {
        errors.zipCode = 'This field is required'
    }
    if (!values.phoneNumber || !values.phoneNumber.trim().length) {
        errors.phoneNumber = 'This field is required';
    } else if (!/\([1-9]{3}\)[0-9]{3}-[0-9]{4}/.test(values.phoneNumber)){
        errors.phoneNumber = 'Invalid Phone Number'
        
    }
    if (!values.timeZone) {
        errors.timeZone = 'This field is required'
    }
    return errors;
}
export default class AddLocation extends Component {
    constructor(props) {
        super(props);
        let stateObj = new UsaStates();
        let stateOptions = stateObj.states;

        let timeZoneOptions = (timezones || []).filter((obj, index, orignArr) => {
            return orignArr.findIndex((item) => item.utcOffset === obj.utcOffset) === index;
        });

        timeZoneOptions = timeZoneOptions.map((obj, index) => ({ ...obj, label: obj.name, value: obj.utcOffset }));

        this.state = {
            facilityTimesData: null,
            facilityModalOpen: false,
            timeZoneOptions: timeZoneOptions,
            stateOptions: (stateOptions || []).map((obj, index) => {
                let option = { label: obj.name, value: obj.abbreviation };
                return option;
            })
        }
    }
    handleFacilityModalOpen = () => {

        this.setState({
            facilityModalOpen: true
        })
    }
    handleFacilityModalClose = () => {
        let field = document.getElementsByName('facilityTimes')[0];

        this.setState({
            facilityModalOpen: false
        }, () => {
            if (field) {
                field.blur()
            }
        })
    }
    passFormData = (facilityTimesData) => {
        this.setState({
            facilityTimesData: facilityTimesData
        })
    }
    handleSubmit = (values) => {
        let postObj = { ...values };
        if (this.props.record) {
            postObj.facilityTimes = this.state.facilityTimesData || this.props.record.facilityTimes;
        } else {
            postObj.facilityTimes = this.state.facilityTimesData || '';
        }

        postObj.appointmentPool = values.appointmentPool.split(",");
        // console.log('postObj--', postObj);
        let db = this.props.db;
        if (this.props.record) {
            let locationsStore = db.transaction("locations", "readwrite").objectStore("locations");
            let request = locationsStore.get(this.props.record.key);
            request.onerror = function (event) {
                // Handle errors!
            };
            request.onsuccess = (event) => {
                // Get the old value that we want to update
                let data = event.target.result;
                // console.log('fetchd data--', data)
                // update the value(s) in the object that you want to change
                data = postObj;
                // console.log('data---', data)
                // Put this updated object back into the database.
                let requestUpdate = locationsStore.put(data, this.props.record.key);
                requestUpdate.onerror = function (event) {
                    // console.log('updatation request failed--');
                    showErrorMsg("Failed to update location");
                };
                requestUpdate.onsuccess = (event) => {
                    showSuccessMsg("Location updated successfuly");
                    // console.log('The data has been written successfully--', event);
                    this.props.handleCloseAddLocationModal();
                    this.props.handleLocationsRefresh();
                };
            };
        } else {
            let request = db.transaction('locations', 'readwrite')
                .objectStore('locations')
                .add(postObj);

            request.onsuccess = (event) => {
                showSuccessMsg("Location added successfuly");
                // console.log('The data has been written successfully--', event);
                this.props.handleCloseAddLocationModal();
                this.props.handleLocationsRefresh();
            };

            request.onerror = (event) => {
                // console.log('The data has been written failed--', event);
                showErrorMsg("Failed to update location");
            }
        }


    }
    render() {
        let record = this.props.record;
        return (
            <Dialog fullWidth maxWidth="md" open={this.props.openAddLocationModal} onClose={this.props.handleCloseAddLocationModal} aria-labelledby="form-dialog-title">
                {this.state.facilityModalOpen ? <FacilityTimesModal passFormData={this.passFormData} record={record} handleFacilityModalClose={this.handleFacilityModalClose} /> : null}
                <DialogTitle  className="c-primary" id="form-dialog-title">{record ? 'Edit Location' : 'Add Location'}</DialogTitle>
                <Formik
                    initialValues={{
                        locationName: (record && record.locationName) || '',
                        addressLine1: (record && record.addressLine1) || '',
                        suiteNo: (record && record.suiteNo) || '',
                        addressLine2: (record && record.addressLine2) || '',
                        city: (record && record.city) || '',
                        state: (record && record.state) || '',
                        zipCode: (record && record.zipCode) || '',
                        phoneNumber: (record && record.phoneNumber) || '',
                        timeZone: (record && record.timeZone) || '',
                        facilityTimes: '',
                        appointmentPool: (record && record.appointmentPool.join(",")) || '',
                    }}
                    onSubmit={this.handleSubmit}
                    validate={validate}
                    enableReinitialize={true}
                >
                    {({ values, errors, touched }) => (
                        <Form>
                            <DialogContent>


                                <div className="row">

                                    <div className="col-sm-12">
                                        <Field
                                            autoFocus
                                            name="locationName"
                                            component={renderTextField}
                                            error={touched.locationName && errors.locationName ?  true : false}
                                            helperText= {touched.locationName && errors.locationName ? errors.locationName : null}
                                            label="Location Name"
                                        />
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <Field
                                            name="addressLine1"
                                            label="Address Line 1"
                                            error={touched.addressLine1 && errors.addressLine1 ?  true : false}
                                            helperText= {touched.addressLine1 && errors.addressLine1 ? errors.addressLine1 : null}
                                            component={renderTextField}
                                        />

                                    </div>
                                    <div className="col-sm-6">
                                        <Field
                                            name="suiteNo"
                                            label="Suite No."
                                            error={touched.suiteNo && errors.suiteNo ?  true : false}
                                            helperText= {touched.suiteNo && errors.suiteNo ? errors.suiteNo : null}
                                            component={renderTextField}
                                        />

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <Field
                                            name="addressLine2"
                                            label="Address Line 2"
                                            component={renderTextField}
                                        />
                                    </div>
                                    <div className="col-sm-3">
                                        <Field
                                            label="City"
                                            name="city"
                                            error={touched.city && errors.city ?  true : false}
                                            helperText= {touched.city && errors.city ? errors.city : null}
                                            component={renderTextField}
                                        />
                                    </div>
                                    <div className="col-sm-3">
                                        <Field
                                            name="state"
                                            label="State"
                                            error={touched.state && errors.state ?  true : false}
                                            helperText= {touched.state && errors.state ? errors.state : null}
                                            options={this.state.stateOptions}
                                            component={renderSingleSelect}
                                        />

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-3">
                                        <Field
                                            name="zipCode"
                                            label="Zip Code"
                                            error={touched.zipCode && errors.zipCode ?  true : false}
                                            helperText= {touched.zipCode && errors.zipCode ? errors.zipCode : null}
                                            maxLength={"10"}
                                            component={renderTextField}
                                        />
                                    </div>
                                    <div className="col-sm-3">
                                        <Field
                                            label="Phone Number"
                                            name="phoneNumber"
                                            error={touched.phoneNumber && errors.phoneNumber ?  true : false}
                                            helperText= {touched.phoneNumber && errors.phoneNumber ? errors.phoneNumber : null}
                                            component={renderPhoneField}
                                        />
                                    </div>
                                    <div className="col-sm-6">
                                        <Field
                                            name="timeZone"
                                            label="Time Zone"
                                            error={touched.timeZone && errors.timeZone ?  true : false}
                                            helperText= {touched.timeZone && errors.timeZone ? errors.timeZone : null}
                                            component={renderSingleSelect}
                                            options={this.state.timeZoneOptions}
                                        />

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <Field
                                            name="facilityTimes"
                                            label="Facility Times"
                                            onFocus={this.handleFacilityModalOpen}
                                            component={renderTextField}
                                        />
                                    </div>
                                    <div className="col-sm-6">
                                        <Field
                                            label="Appointment Pool"
                                            name="appointmentPool"
                                            component={renderTextField}
                                        />

                                    </div>
                                </div>
                            </DialogContent>

                            <DialogActions>
                                <Button variant="contained" onClick={this.props.handleCloseAddLocationModal} color="secondary">
                                    Cancel
                </Button>
                                <Button variant="contained" type="submit" color="primary">
                                    {record ? 'Update' : 'Save'}
                                </Button>
                            </DialogActions>
                        </Form>)}
                </Formik>
            </Dialog>
        )
    }
}
