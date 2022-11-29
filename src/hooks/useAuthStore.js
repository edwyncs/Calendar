import { useDispatch, useSelector } from "react-redux";
import calendarApi from "../api/calendarApi";
import { clearErrorMessage, onChecking, onLogin, onLogout, onLogoutCalendar } from "../store";

export const useAuthStore = () => {

    const dispatch = useDispatch();
    const { status, user, errorMessage } = useSelector(state => state.auth);

    const startLogin = async({email,password}) => {
        dispatch(onChecking());
        try {
            const {data} = await calendarApi.post('/auth', {email, password});
            const {token, name, uid} = data;
            localStorage.setItem('token', token);
            localStorage.setItem('toen-init-date', new Date().getTime());
            dispatch(onLogin({name, uid}));
        } catch (error) {
            const {data} = error.response;
            if(data?.msg){
                dispatch(onLogout(data.msg));
            }
            else{
                let msg = '';
                for (const error in data.errors) {
                    if (Object.hasOwnProperty.call(data.errors, error)) {
                        msg += data.errors[error].msg + ', ';
                    }
                }
                msg = msg.substring(0, msg.length - 2);
                dispatch(onLogout(msg));
            }
            setTimeout(() => {
                dispatch(clearErrorMessage())
            },10);
        };
    };

    const startRegister = async({name, email, password}) => {
        dispatch(onChecking());
        try {
            const {data} = await calendarApi.post('/auth/new', {name, email, password});
            const {token, uid} = data;
            localStorage.setItem('token', token);
            localStorage.setItem('toen-init-date', new Date().getTime());
            dispatch(onLogin({name, uid}));
        } catch (error) {
            const {data} = error.response;
            if(data?.msg){
                dispatch(onLogout(data.msg));
            }
            else{
                let msg = '';
                for (const error in data.errors) {
                    if (Object.hasOwnProperty.call(data.errors, error)) {
                        msg += data.errors[error].msg + ', ';
                    }
                }
                msg = msg.substring(0, msg.length - 2);
                dispatch(onLogout(msg));
            }
            setTimeout(() => {
                dispatch(clearErrorMessage())
            },10);
        }
    }

    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if(!token) return dispatch(onLogout());

        try {
            const {data} = await calendarApi.get('/auth/renew');
            const {name, token, uid} = data;
            localStorage.setItem('token', token);
            localStorage.setItem('toen-init-date', new Date().getTime());
            dispatch(onLogin({name, uid}));
        } catch (error) {
            localStorage.clear();
            dispatch(onLogout());
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogoutCalendar());
        dispatch(onLogout());
    }
    
  return {
    // Propiedades
    status,
    user,
    errorMessage,
    // Metodos
    
    startLogin,
    startRegister,
    checkAuthToken,
    startLogout
  };
};