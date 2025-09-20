import { Toast } from "@openedx/paragon";
import './toast.scss'

export default function CustomToast({ show, onClose = () => { }, children ,status=""}) {
    return <Toast
        show={show}
        onClose={onClose}
        data-testid="taxonomy-toast"
        className={`toaster-custom ${status}`}
    >
        {children}
    </Toast>
}