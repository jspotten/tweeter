import "./Toaster.css";
import {useEffect, useState} from "react";
import { Toast } from "react-bootstrap";
import useToaster from "./ToastHook";
import {ToastPresenter, ToastView} from "../../presenter/ToastPresenter";

interface Props {
  position: string;
}

const Toaster = ({ position }: Props) => {
  const { toastList, deleteToast } = useToaster();

  const listener: ToastView = {
    toastList: toastList,
    deleteToast: deleteToast,
  }

  const [presenter] = useState(new ToastPresenter(listener))

  useEffect(() => {
    const interval = setInterval(() => {
      if (toastList.length) {
        presenter.deleteExpiredToasts();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [toastList]);

  return (
    <>
      <div className={`toaster-container ${position}`}>
        {toastList.map((toast, i) => (
          <Toast
            id={toast.id}
            key={i}
            className={toast.bootstrapClasses}
            autohide={false}
            show={true}
            onClose={() => deleteToast(toast.id)}
          >
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto">{toast.title}</strong>
            </Toast.Header>
            <Toast.Body>{toast.text}</Toast.Body>
          </Toast>
        ))}
      </div>
    </>
  );
};

export default Toaster;
