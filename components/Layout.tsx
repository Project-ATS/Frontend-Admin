import "animate.css"
import { useState } from "react";

import { useAppSelector } from "../state/hooks";
import Toolbar from "./general/Toolbar";


const Layout = ({ children }: any) => {
    const [openModal, setOpenModal] = useState(false)
    // const { chainId } = useAppSelector(state => state.account)


    return (
        <>
            <div className="flex flex-col w-screen relative">
                <Toolbar />
                <div className="w-full h-full relative">
                    {children}
                </div>
            </div>

        </>
    )
}


export default Layout
