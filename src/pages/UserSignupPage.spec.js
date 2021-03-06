import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import {UserSignupPage} from './UserSignupPage';

describe('UserSignupPage', ()=>{
    describe('layout', ()=>{
        it('has header of signup', ()=>{
            const {container} = render(<UserSignupPage/>);
            const header = container.querySelector('h1');
            expect(header).toHaveTextContent('Sign Up');
        });
        it('has input for display name', ()=>{
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const displayNameInput = queryByPlaceholderText('Your display name');
            expect(displayNameInput).toBeInTheDocument();
        });
        it('has input for username', ()=>{
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const usernameInput = queryByPlaceholderText('Your username');
            expect(usernameInput).toBeInTheDocument();
        });
        it('has input for password', ()=>{
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const passwordInput = queryByPlaceholderText('Your password');
            expect(passwordInput).toBeInTheDocument();
        });
        it('has password type for password input', ()=>{
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const passwordInput = queryByPlaceholderText('Your password');
            expect(passwordInput.type).toBe('password');
        });
        it('has input for password repeat', ()=>{
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const passwordRepeatInput = queryByPlaceholderText('Repeat your password');
            expect(passwordRepeatInput).toBeInTheDocument();
        });
        it('has password type for password repeat input', ()=>{
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const passwordRepeatInput = queryByPlaceholderText('Your password');
            expect(passwordRepeatInput.type).toBe('password');
        });
        it('has submit button', ()=>{
            const {container} = render(<UserSignupPage/>);
            const button = container.querySelector('button');
            expect(button).toBeInTheDocument();
        });
    });
    describe('interactions', ()=>{
        const changeEvent = (content)=>{
            return {
                target:{
                    value: content
                }
            }
        }

        let button, displayNameInput, usernameInput, passwordInput, passwordRepeatInput;

        const setupForSubmit = (props)=>{
            const rendered = render(<UserSignupPage {...props}/>);

            const {container, queryByPlaceholderText} = rendered;

            displayNameInput = queryByPlaceholderText('Your display name');
            usernameInput = queryByPlaceholderText('Your username');
            passwordInput = queryByPlaceholderText('Your password');
            passwordRepeatInput = queryByPlaceholderText('Repeat your password');
            
            fireEvent.change(displayNameInput, changeEvent('my-display-name'));
            fireEvent.change(usernameInput, changeEvent('my-username'));
            fireEvent.change(passwordInput, changeEvent('P4ssword'));
            fireEvent.change(passwordRepeatInput, changeEvent('P4ssword'));

            button = container.querySelector('button');

            return rendered;
        }

        const mockAsyncDelayed = ()=>{
            return jest.fn().mockImplementation(()=>{
                return new Promise((resolve, reject)=>{
                    setTimeout(()=>{
                        resolve({});
                    }, 300);
                });
            });
        }

        it('set displayName value to state', ()=>{
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const displayNameInput = queryByPlaceholderText('Your display name');
            
            fireEvent.change(displayNameInput, changeEvent("my-display-name"));
            expect(displayNameInput).toHaveValue('my-display-name');
        });
        it('set username value to state', ()=>{
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const usernameInput = queryByPlaceholderText('Your username');
            
            fireEvent.change(usernameInput, changeEvent("my-username"));
            expect(usernameInput).toHaveValue('my-username');
        });
        it('set password value to state', ()=>{
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const passwordInput = queryByPlaceholderText('Your password');
            
            fireEvent.change(passwordInput, changeEvent("P4ssword"));
            expect(passwordInput).toHaveValue('P4ssword');
        });
        it('set password repeat value to state', ()=>{
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const passwordRepeatInput = queryByPlaceholderText('Repeat your password');
            
            fireEvent.change(passwordRepeatInput, changeEvent("P4ssword"));
            expect(passwordRepeatInput).toHaveValue('P4ssword');
        });
        it('calls postSignup when the fields are valid and actions are provided to props', ()=>{
            const actions = {
                postSignup: jest.fn().mockResolvedValueOnce({})
            }
            
            setupForSubmit({actions});
            
            fireEvent.click(button);

            expect(actions.postSignup).toHaveBeenCalledTimes(1);
        });
        it('does not throw exception when clicking the button when actions not provided in props', ()=>{
            setupForSubmit();
            expect(()=>fireEvent.click(button)).not.toThrow();
        });
        it('calls post with user body when the fields are valid', ()=>{
            const actions = {
                postSignup: jest.fn().mockResolvedValueOnce({})
            }
            setupForSubmit({actions});
            fireEvent.click(button);
            const expectedUser = {
                username:"my-username",
                displayName:"my-display-name",
                password:"P4ssword"
            }

            expect(actions.postSignup).toHaveBeenCalledWith(expectedUser);
        });
        it('does not allow user to click the signup button when there is an ongoing api call', ()=>{
            const actions = {
                postSignup: mockAsyncDelayed()
            }
            setupForSubmit({actions});
            fireEvent.click(button);
            fireEvent.click(button);
            expect(actions.postSignup).toBeCalledTimes(1);
        });
        it('displays spinner when there is an ongoing api call', ()=>{
            const actions = {
                postSignup: mockAsyncDelayed()
            }
            const {queryByText} = setupForSubmit({actions});

            fireEvent.click(button);
            
            const spinner = queryByText('Loading...');

            expect(spinner).toBeInTheDocument();
        });
        it('hide spinner when api call finishes successfully', async ()=>{
            const actions = {
                postSignup: mockAsyncDelayed()
            }
            const {queryByText} = setupForSubmit({actions});

            fireEvent.click(button);
            const spinner = queryByText('Loading...');
            await waitFor(()=>{
                expect(spinner).not.toBeInTheDocument();
            });
        });
        it('hide spinner when api call finishes with error', async ()=>{
            const actions = {
                postSignup: jest.fn().mockImplementation(()=>{
                    return new Promise((resolve, reject)=>{
                        setTimeout(()=>{
                            reject({
                                response:{data:{}}
                            });
                        }, 300);
                    });
                })
            }
            const {queryByText} = setupForSubmit({actions});

            fireEvent.click(button);
            const spinner = queryByText('Loading...');
            await waitFor(()=>{
                expect(spinner).not.toBeInTheDocument();
            });
        });
    });
});

console.error = ()=>{};