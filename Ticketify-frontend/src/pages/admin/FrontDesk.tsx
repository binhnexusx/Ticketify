import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function FrontDesk() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="flex gap-2">
        <Badge className="bg-orange-100 text-orange-500">Due in</Badge>
        <Badge className="bg-blue-100 text-blue-600">Checked out</Badge>
        <Badge className="bg-red-100 text-red-500">Due out</Badge>
        <Badge className="bg-green-100 text-green-600">Checked in</Badge>
      </div>
      <Button
        className="bg-blue-600 text-white"
        onClick={() => navigate("check-available")}
      >
        Create booking
      </Button>
    </div>
  )
}
