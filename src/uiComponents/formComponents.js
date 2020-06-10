import React from 'react';
import { TextField, InputLabel, Input, FormControl, FormHelperText } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import MaskedInput from 'react-text-mask';

export const renderTextField = ({
    field, // { name, value, onChange, onBlur }
    form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    maxLength,
    ...customProps
}) => {

    return (<TextField
        {...field}
        {...customProps}
        inputProps={{ maxLength: maxLength }}
        type="text"
        fullWidth
        margin={'normal'}
        multiline={false}

    />)
}

export const renderSingleSelect = ({ field, form, label, options,error, ...customProps }) => {
    return (
        <FormControl error={error} fullWidth className="single-select">
            <InputLabel id={label}>{label}</InputLabel>
            <Select
                {...field}

                {...customProps}
                id={label}
                fullWidth
            >{(options || []).map((opt, index) => (<MenuItem key={index} value={opt.value}>{opt.label}</MenuItem>))}
            </Select>
            {customProps.helperText ?
                <FormHelperText className="Mui-error">{customProps.helperText}</FormHelperText> : null}
        </FormControl>
    )
}

function maskedPhoneComponent(props) {
    const { inputRef, ...other } = props;
    return (
        <MaskedInput
            {...other}
            ref={(ref) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={['(', /[1-9]/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
}
export const renderPhoneField = ({ field, form, label, ...customProps }) => {
    return (
        <FormControl className="phone-field">
            <InputLabel htmlFor={label}>{label}</InputLabel>
            <Input

                {...field}
                {...customProps}
                inputComponent={maskedPhoneComponent}
                fullWidth
            />
            {customProps.helperText ?
                <FormHelperText className="Mui-error">{customProps.helperText}</FormHelperText> : null}
        </FormControl>

    )
}
function maskedTimeComponent(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            keepCharPositions={false}
            mask={[/[0-2]/, /[0-9]/, ':', /[0-5]/, /[0-9]/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
}
export const renderTimeField = ({
    field, // { name, value, onChange, onBlur }
    form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    ...customProps
}) => {

    return (<FormControl className="phone-field">
        <Input
            {...field}
            {...customProps}
            inputComponent={maskedTimeComponent}
        />
    </FormControl>)
}