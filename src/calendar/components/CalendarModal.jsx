import { useState } from "react";
import { addHours, differenceInSeconds, set } from "date-fns";

import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css"

import Modal from "react-modal";

import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import es from 'date-fns/locale/es'
import { useMemo } from "react";
import { useCalendarStore, useUiStore } from "../../hooks";
import { useEffect } from "react";

registerLocale('es', es);

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

export const CalendarModal = () => {

    const [formSubmited, setFormSubmited] = useState(false);

    const {activeEvent, startSavingEvent} = useCalendarStore();

    const { isDateModalOpen,
            closeDateModal,
    } = useUiStore();

    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours(new Date(), 2)
    });

    const titleClass = useMemo(() => {
        if(!formSubmited) return;

        return (formValues.title.length > 0)
            ? ''
            : 'is-invalid';
    }, [formValues.title, formSubmited]);

    useEffect(() => {
      if (activeEvent !== null) {
        setFormValues({...activeEvent});
      }
    }, [activeEvent])
    

    const onImputChanged = ({target}) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        });
    };

    const onDateChanged = (newDate, order) => {
        setFormValues({
            ...formValues,
            [order]: newDate
        });
    };

    const onSubmit = async(event) => {
        event.preventDefault();
        setFormSubmited(true);
        const difference = differenceInSeconds(formValues.end, formValues.start);

        if (isNaN(difference) || difference <= 0) {
            Swal.fire('Fechas incorrectas', 'Revisar las fechas ingresadas', 'error')
            return;
        }
        if (formValues.title.length <= 0 ) return;

        //TODO:
        await startSavingEvent(formValues);
        closeDateModal();
        setFormSubmited(false)
        //cerrar modal
        //resolver errores en pantalla
    }
    return (
        <Modal
        isOpen={isDateModalOpen}
        onRequestClose={closeDateModal}
        style={customStyles}
        className="modal"
        overlayClassName="modal-fondo"
        closeTimeoutMS={200}
        >
            <h1> Nuevo evento </h1>
            <hr />
            <form className="container" onSubmit={onSubmit}>
                <div className="form-group mb-2">
                <label>Fecha y hora inicio</label>
                <DatePicker
                    className="form-control"
                    selected={formValues.start}
                    onChange={(newDate) => onDateChanged(newDate, 'start')}
                    dateFormat="Pp"
                    showTimeSelect
                    locale='es'
                    timeCaption="Hora"
                />
                </div>

                <div className="form-group mb-2">
                <label>Fecha y hora fin</label>
                <DatePicker
                    minDate={formValues.start}
                    className="form-control"
                    selected={formValues.end}
                    onChange={(newDate) => onDateChanged(newDate, 'end')}
                    dateFormat="Pp"
                    showTimeSelect
                    locale='es'
                    timeCaption="Hora"
                />
                </div>

                <hr />
                <div className="form-group mb-2">
                <label>Titulo y notas</label>
                <input
                    type="text"
                    className={`form-control ${titleClass}`}
                    placeholder="Título del evento"
                    name="title"
                    autoComplete="off"
                    value={formValues.title}
                    onChange={onImputChanged}
                />
                <small id="emailHelp" className="form-text text-muted">
                    Una descripción corta
                </small>
                </div>

                <div className="form-group mb-2">
                <textarea
                    type="text"
                    className="form-control"
                    placeholder="Notas"
                    rows="5"
                    name="notes"
                    value={formValues.notes}
                    onChange={onImputChanged}
                ></textarea>
                <small id="emailHelp" className="form-text text-muted">
                    Información adicional
                </small>
                </div>

                <button type="submit" className="btn btn-outline-primary btn-block">
                <i className="far fa-save"></i>
                <span> Guardar</span>
                </button>
            </form>
        </Modal>
    );
};
