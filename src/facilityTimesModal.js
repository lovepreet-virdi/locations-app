import React, { Component } from 'react'
import { ButtonGroup, Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel } from '@material-ui/core';
import { Field, Formik, Form } from 'formik';
import { renderTimeField } from './uiComponents/formComponents';
const validate = (values) => {
    const errors = {};
    let timeRegex = /((1[0-1]):([0-5][0-9])|((1[2-9]|2[0-3]):([0-5][0-9])))|((0[1-9]):([0-5][0-9]))/;
    let weekArrayErrors = [];
    for (let i = 0; i < values.week.length; i++) {

        let weekErrors = {}
        if (!values.week[i].from && values.week[i].to) {

            weekErrors.from = true;
            weekArrayErrors[i] = weekErrors
        }
        if (!values.week[i].to && values.week[i].from) {

            weekErrors.to = true;
            weekArrayErrors[i] = weekErrors
        }
        if (values.week[i].from && !timeRegex.test(values.week[i].from)) {
            weekErrors.from = true;
            weekArrayErrors[i] = weekErrors
        }
        if (values.week[i].to && !timeRegex.test(values.week[i].to)) {
            weekErrors.to = true;
            weekArrayErrors[i] = weekErrors
        }

    };
    if (weekArrayErrors.length) {
        errors.week = weekArrayErrors;
    }
    return errors;
}
export default class FacilityTimesModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            weekArr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'],
            week: [],
        }
    }
    handleClose = () => {
        this.props.handleFacilityModalClose()
    }
    isAm = (time = '') => {

        let isValid = /((1[0-1]):([0-5][0-9]))|((0[1-9]):([0-5][0-9]))/.test(time);

        return isValid;
    }
    handleCheckboxChange = (input, index) => {
        let week = this.state.week;
        week[index] = input.target.checked;
        this.setState({
            weeek: week
        })
    }
    handleCopy = async (event, setFieldValue, obj) => {
        event.preventDefault();
        for (let i = 0; i < this.state.week.length; i++) {
            if (this.state.week[i]) {
                await setFieldValue(`week[${i}].from`, obj.from, false);
                await setFieldValue(`week[${i}].to`, obj.to, true);
            }
        }

    }
    handleSubmit = (formData) => {
        this.props.passFormData(formData);
        this.props.handleFacilityModalClose()
    }
    render() {
        let record = this.props.record;
        return (
            <Dialog maxWidth="md" fullWidth open={this.state.open} onClose={this.handleClose} >
                <DialogTitle className="c-primary">Facility Times</DialogTitle>
                <Formik
                    validate={validate}
                    onSubmit={this.handleSubmit}
                    initialValues={{
                        week: record && record.facilityTimes && record.facilityTimes.week && record.facilityTimes.week.length ? record.facilityTimes.week : [{ check: '', from: '', to: '' },
                        { check: '', from: '', to: '' },
                        { check: '', from: '', to: '' },
                        { check: '', from: '', to: '' },
                        { check: '', from: '', to: '' },
                        { check: '', from: '', to: '' },
                        { check: '', from: '', to: '' }]
                    }}

                    enableReinitialize={true}
                >
                    {({ values, errors, setFieldValue }) => <Form>
                        <DialogContent>
                        <div className="row mt-3" >
                            <div className="col-sm-3 offset-2 text-right">
                                <b>From</b>
                            </div>
                            <div className="col-sm-5">
                                <b>To</b>
                            </div>
                            </div>
                            {this.state.weekArr.map((day, index) => {
                                return (<div className="row mt-3" key={index}>
                                    <div className="col-sm-2">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={(this.state.week && this.state.week[index]) || false}
                                                    onChange={(input) => this.handleCheckboxChange(input, index)}
                                                    name={`week[${index}].check`}
                                                    color="primary"
                                                />
                                            }
                                            label={day}
                                        />
                                    </div>
                                    <div className="col-sm-3">
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <Field
                                                    name={`week[${index}].from`}
                                                    component={renderTimeField}
                                                    error={errors.week && errors.week[index] && errors.week[index].from ? true : false}

                                                />
                                            </div>
                                            <div className="col-sm-8">

                                                <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                                                    <Button className={!this.isAm(values.week[index].from) ? 'grey-btn' : ''}>Am</Button>
                                                    <Button className={this.isAm(values.week[index].from) ? 'grey-btn' : ''}>Pm</Button>

                                                </ButtonGroup>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="col-sm-3">
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <Field
                                                    name={`week[${index}].to`}
                                                    component={renderTimeField}
                                                    error={errors.week && errors.week[index] && errors.week[index].to ? true : false}

                                                />
                                            </div>
                                            <div className="col-sm-8">
                                                <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                                                    <Button className={!this.isAm(values.week[index].to) ? 'grey-btn' : ''}>Am</Button>
                                                    <Button className={this.isAm(values.week[index].to) ? 'grey-btn' : ''}>Pm</Button>

                                                </ButtonGroup>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <Button onClick={(event) => this.handleCopy(event, setFieldValue, values.week[index])} variant="outlined" color="primary">
                                            Apply To All Checked
                                        </Button>
                                    </div>

                                </div>)
                            })}
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" onClick={this.handleClose} color="secondary">
                                Cancel
                </Button>
                            <Button variant="contained" type="submit" color="primary">
                                {record ? 'Update' : 'Save'}
                            </Button>
                        </DialogActions>
                    </Form>}
                </Formik>

            </Dialog>
        )
    }
}
