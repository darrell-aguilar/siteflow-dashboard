import { useEffect } from 'react'
import '../App.css'

export default function PopUp({messages, setMessages}) {
    const handleDelete = (event) => {
        const id = event.currentTarget.parentNode.getAttribute('count')
        setMessages(oldArray => oldArray.filter(msg => msg.id != id))
    }

    useEffect(() => {
        const removePopUp = () => {
            if (messages.length === 0) {
                return
            }
            setTimeout(() => {
                setMessages(oldArray => oldArray.filter(msg => oldArray.indexOf(msg) !== 0))
            }, 3000)
        }

        removePopUp()
    }, [messages])

    if (messages.length === 0)
    return (
        <></>
    )
    else return (
        <div className='position-absolute w-25 h-75 top-0 end-0 mt-4'>
            {messages.map((message, id) => 
                <PopUpStyle key={id} count={message.id} color={message.state} handleDelete={handleDelete}>
                    {message.msg}
                </PopUpStyle>
                )}
        </div>
    )
}

function PopUpStyle({color, children, handleDelete, count}) {
    return (
        <div className={`border rounded pt-1 pb-2 mb-1 text-white ${color === "success" ? "bg-primary" : "bg-danger"}`} count={count}>
             {children}
            <i onClick={handleDelete} className="bi bi-x-circle-fill px-2 text-dark fs-4" id="delete-popup"></i>
        </div>
    )
}
