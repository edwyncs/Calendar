import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../hooks';
import { useForm } from '../../hooks/useForm';
import { clearErrorMessage } from '../../store';
import './LoginPage.css';

const loginFormFields = {
    loginEmail: '',
    loginPassword: '',
}

const registerFormFields = {
    registerName: '',
    registerEmail: '',
    registerPassword: '',
    registerPasswordC: '',
}

export const LoginPage = () => {

    const {loginEmail, loginPassword, onInputChange:onLoginInputChange} = useForm(loginFormFields); 
    
    const {registerName, registerEmail, registerPassword, registerPasswordC, onInputChange:onRegisterInputChange} = useForm(registerFormFields); 
    
    const {startLogin, startRegister,errorMessage} = useAuthStore();

    const dispatch = useDispatch();

    useEffect(() => {
      if(errorMessage !== undefined ){
        Swal.fire('Authentication error', errorMessage, 'error');
    }

    }, [errorMessage])
    
    
    const loginSubmit = (event) => {
        event.preventDefault();
        startLogin({email: loginEmail, password: loginPassword});
    }

    const registerSubmit = (event) => {
        event.preventDefault();
        if(registerPassword !== registerPasswordC){
            Swal.fire('Authentication error', 'the passwords do not match', 'error')
            return;
        }
        startRegister({name: registerName, email: registerEmail, password: registerPassword});
    }

    return (
        <div className="container login-container">
            <div className="row col-md-12">
                <div className="col-md-6 login-form-1">
                    <h3>Ingreso</h3>
                    <form onSubmit={loginSubmit}>
                        <div className="form-group mb-2">
                            <input 
                                type="text"
                                className="form-control"
                                placeholder="Correo"
                                name="loginEmail"
                                value={loginEmail}
                                onChange={onLoginInputChange}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                name="loginPassword"
                                value={loginPassword}
                                onChange={onLoginInputChange}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input 
                                type="submit"
                                className="btnSubmit"
                                value="Login" 
                            />
                        </div>
                    </form>
                </div>

                <div className="col-md-6 login-form-2">
                    <h3>Registro</h3>
                    <form onSubmit={registerSubmit}>
                        <div className="form-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre"
                                name='registerName'
                                value={registerName}
                                onChange={onRegisterInputChange}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Correo"
                                name='registerEmail'
                                value={registerEmail}
                                onChange={onRegisterInputChange}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                name='registerPassword'
                                value={registerPassword}
                                onChange={onRegisterInputChange}
                            />
                        </div>

                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Repita la contraseña"
                                name='registerPasswordC'
                                value={registerPasswordC}
                                onChange={onRegisterInputChange}
                            />
                        </div>

                        <div className="form-group mb-2">
                            <input 
                                type="submit" 
                                className="btnSubmit" 
                                value="Crear cuenta" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}