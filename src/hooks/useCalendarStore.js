import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2";
import calendarApi from "../api/calendarApi";
import { convertDate } from "../helpers";
import { filterEvents } from "../helpers/filterEvents";
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";

export const useCalendarStore = () => {
    const {events, activeEvent} = useSelector(state => state.calendar);
    const {user} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent));
    }

    const startSavingEvent = async(calendarEvent) => {
        try {
            if (calendarEvent.id) {
                //Actualizando
                const {data} = await calendarApi.put(`/events/${calendarEvent.id}`,calendarEvent);
                dispatch(onUpdateEvent({...calendarEvent, user}));
                return;
            }
    
            //Crando
            const {data} = await calendarApi.post('/events', calendarEvent);
            dispatch(onAddNewEvent({...calendarEvent, id: data.event.id, user}))
        } catch (error) {
            const {msg} = error.response.data;
            Swal.fire('Error', msg, 'error');
        }
    }

    const startDeleteEvent = async() => {
        try {
            await calendarApi.delete(`/events/${activeEvent.id}`);
            dispatch(onDeleteEvent());
        } catch (error) {
            const {msg} = error.response.data;
            Swal.fire('Error', msg, 'error');
        }
    }

    const startLoadingEvents = async() => {
        try {
            const { data } = await calendarApi.get('/events')
            const events = convertDate(data.msg)
            dispatch(onLoadEvents(filterEvents(events, user.uid)));
        } catch (error) {
            console.log(error);
        }
    }
    
    return {
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,

        setActiveEvent,
        startSavingEvent,
        startDeleteEvent,
        startLoadingEvents
    }
}