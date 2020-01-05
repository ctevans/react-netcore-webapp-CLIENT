import React, { useContext } from 'react'
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../app/common/form/TextInput';
import { Button, Form, Header } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import { IUserFormValues } from '../../app/models/user';
import { FORM_ERROR } from 'final-form';
import { combineValidators, isRequired } from 'revalidate';
import ErrorMessage from '../activities/form/ErrorMessage';

const validate = combineValidators({
    email: isRequired('email'),
    password: isRequired('password'),
    displayName: isRequired('displayName'),
    username: isRequired('username')
});

const RegisterForm = () => {
    const rootStore = useContext(RootStoreContext);
    const { register } = rootStore.userStore;

    return (
        <FinalForm
            onSubmit={(values: IUserFormValues) => register(values).catch(error => ({ [FORM_ERROR]: error }))}
            validate={validate}
            render={({ handleSubmit, submitting, form, submitError, invalid, pristine, dirtySinceLastSubmit }) => (
                <Form onSubmit={handleSubmit} error>
                    <Header as='h2' content="Sign Into App" color='teal' textAlign='center' />
                    <Field
                        name='email'
                        component={TextInput}
                        placeholder='Email' />
                    <Field
                        name='username'
                        component={TextInput}
                        placeholder='Username' />
                    <Field
                        name='displayName'
                        component={TextInput}
                        placeholder='Display Name' />
                    <Field
                        name='password'
                        component={TextInput}
                        placeholder='Password'
                        type='password' />
                    {submitError && !dirtySinceLastSubmit && <ErrorMessage error={submitError} />}
                    <br />
                    <Button disabled={invalid && !dirtySinceLastSubmit || pristine} color='teal' loading={submitting} content="Login" fluid />
                </Form >
            )}
        />
    );
}

export default RegisterForm;