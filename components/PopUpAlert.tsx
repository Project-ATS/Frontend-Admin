import { Alert } from "@mui/material"
import { useEffect } from "react"

const PopUpAlert = ({ isSuccess, successMessage, deniedMessage, setVisualAlert }: any) => {
  useEffect(() => {
    let timer = setTimeout(() => setVisualAlert(false), 3000)
    return () => {clearTimeout(timer)}
  })

  return (
    <div className="fixed bottom-2 right-2">
      <Alert severity={isSuccess ? "success" : "error"}>
        {isSuccess ? successMessage : deniedMessage}
      </Alert>
    </div>
  )
}

export default PopUpAlert