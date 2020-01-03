import React from 'react'
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';
import { DateTimePicker } from 'react-widgets';

interface IProps extends FieldRenderProps<Date, HTMLElement>, FormFieldProps { }

const DateInput: React.FC<IProps> = ({ input, width, placeholder, meta: { touched, error }, id, ...rest }) => {
    return (
        <Form.Field error={touched && !!error}>
            <DateTimePicker
                id={id?.toString()}
                placeholder={placeholder}
                value={input.value || null}
                onChange={input.onChange}
                {...rest}
            />
            {touched && error && (
                <Label basic color='red'>
                    {error}
                </Label>
            )}
        </Form.Field>
    )
}


export default DateInput;