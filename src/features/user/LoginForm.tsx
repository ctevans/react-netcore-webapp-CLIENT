import React from 'react'
import { Form as FinalForm, Field, Form } from 'react-final-form';
import TextInput from '../../app/common/form/TextInput';
import { Button } from 'semantic-ui-react';

export const LoginForm = () => {
    return (
        <FinalForm
            onSubmit={(values) => console.log(values)}
            render={({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                    <Field
                        name='email'
                        component={TextInput}
                        placeholder='Email' />
                    />
                <Field
                        name='password'
                        component={TextInput}
                        placeholder='Password'
                        type='password' />
                    <Button positive content="Login" />
                    />
            </Form>
            )}
        />
    )
}
