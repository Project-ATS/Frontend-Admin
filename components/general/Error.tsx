import {BiError} from "react-icons/bi"


const Error = () => {
    return (
        <div className='w-screen h-screen flex flex-col space-y-10 items-center justify-center'>
            <BiError className="text-red-500 text-6xl" />
            <p className="text-xl">Something went wrong...</p>
        </div>
    )
}

export default Error