import { useState } from "react"
import Link from 'next/link'
import { HiMenuAlt4 } from "react-icons/hi"
import { MdClose } from "react-icons/md"
import { BsCart, BsCart2, BsPerson, BsPlus } from "react-icons/bs"
import { useAppSelector } from "../../state/hooks"


const Toolbar = ({ dark }: any) => {
    const [open, setOpen] = useState(false)
    const { user } = useAppSelector((state) => state.account.walletConfig)
console.log(user)
    return (
        <div className="w-full flex items-center justify-between py-3 px-5">

            <div className="flex space-x-5">
                <Link href="/">
                    <a><img src="/images/atf-logo.png" className="h-12" /></a>
                </Link>

            </div>
            <div className="">
                {user.userAddress?"Address: "+user.userAddress:null}

            </div>


            <div className="flex items-center space-x-5">

                <Link href="/profile">
                    <a><BsPerson className="text-4xl" /></a>
                </Link>

            </div>

        </div >

    )
}

export default Toolbar
