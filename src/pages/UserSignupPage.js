import React from "react";
import Input from "../components/input";

export class UserSignupPage extends React.Component{
    state = {
        displayName: "",
        username: "",
        password: "",
        passwordRepeat: "",
        pendingApiCall: false,
        errors: {},
        passwordRepeatConfirmed: true
    }
    onchangeDisplayName = (event)=>{
        const value = event.target.value;
        const errors = {...this.state.errors}
        delete errors.displayName;
        this.setState({
            displayName: value,
            errors
        });
    }
    onChangeUsername = (event)=>{
        const value = event.target.value;
        const errors = {...this.state.errors}
        delete errors.username;
        this.setState({
            username: value,
            errors
        });
    }
    onChangePassword = (event)=>{
        const value = event.target.value;
        const passwordRepeatConfirmed = this.state.passwordRepeat === value;
        const errors = {...this.state.errors}
        delete errors.password;
        errors.passwordRepeatError = passwordRepeatConfirmed ? "" : "Does not match to password";
        this.setState({
            password: value,
            passwordRepeatConfirmed,
            errors
        });
    }
    onChangePasswordRepeat = (event)=>{
        const value = event.target.value;
        const passwordRepeatConfirmed = this.state.password === value;
        const errors = {...this.state.errors}
        delete errors.passwordRepeat;
        errors.passwordRepeatError = passwordRepeatConfirmed ? "" : "Does not match to password";
        this.setState({
            passwordRepeat: value,
            passwordRepeatConfirmed,
            errors
        });
    }
    onClickSignup = ()=>{
        if(this.props.actions){
            const user = {
                username: this.state.username,
                displayName: this.state.displayName,
                password: this.state.password
            }
            this.setState({pendingApiCall: true});
            this.props.actions.postSignup(user)
                .then((response)=>{
                    this.setState({pendingApiCall: false});
                    console.log("user saved successfully");
                }).catch((apiError)=>{
                    let errors = {...this.state.errors}
                    if(apiError.response.data && apiError.response.data.validationErrors){
                        console.log(apiError.response.data.validationErrors);
                        errors = apiError.response.data.validationErrors;
                    }
                    this.setState({pendingApiCall: false, errors});
                    console.log("Error in saving user", this.state);
                });
        }
    }
    render(){
        return(
            <div className="container">
                <h1 className="text-center">Sign Up</h1>
                <div className="col-12 mb-3">
                    <Input
                        label="Display Name:"
                        placeholder="Your display name" 
                        value={this.state.displayName}
                        onChange={this.onchangeDisplayName}
                        hasError={this.state.errors.displayName && true}
                        error={this.state.errors.displayName}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Input
                        label="Username:"
                        placeholder="Your username"
                        value={this.state.username}
                        onChange={this.onChangeUsername}
                        hasError={this.state.errors.username && true}
                        error={this.state.errors.username}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Input
                        label="Password:"
                        type="password" 
                        placeholder="Your password" 
                        value={this.state.password}
                        onChange={this.onChangePassword}
                        hasError={this.state.errors.password && true}
                        error={this.state.errors.password}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Input
                        label="Repeat Password:"
                        type="password" 
                        placeholder="Repeat your password"
                        value={this.state.passwordRepeat}
                        onChange={this.onChangePasswordRepeat}
                        hasError={this.state.errors.passwordRepeatError && true}
                        error={this.state.errors.passwordRepeatError}
                    />
                </div>
                <div className="text-center">
                    <button 
                        className="btn btn-primary"
                        onClick={this.onClickSignup}
                        disabled={this.state.pendingApiCall || !this.state.passwordRepeatConfirmed}
                    >
                        {
                            this.state.pendingApiCall &&
                            <div className="spinner-border text-light spinner-border-sm mr-sm-1" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        }
                        Sign Up</button>
                </div>
            </div>
        );
    }
}

UserSignupPage.defaultProps = {
    actions:{
        postSignup: ()=>new Promise((resolve, reject)=>{
            resolve({});
        })
    }
}

export default UserSignupPage;