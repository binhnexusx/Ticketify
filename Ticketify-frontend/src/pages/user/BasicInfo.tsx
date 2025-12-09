import { useEffect, useState } from "react"
import BasicInfoView from "@/components/layout/profile/BasicInfoView"
import BasicInfoEdit from "@/components/layout/profile/BasicInfoEdit"
import { getUser, updateUser } from "@/services/profile"
import type { UserData } from "@/types/auth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast";

export type BasicInfoData = {
  firstName: string
  lastName: string
  dob: string
  gender: string
  mobile: string
  email: string
  avatar: string | File | null
}

const BasicInfo = () => {
  const [user, setUser] = useState<UserData | null>(null)
  const [formData, setFormData] = useState<BasicInfoData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogMessage, setDialogMessage] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const localUser = localStorage.getItem('user') || sessionStorage.getItem('user')
        if (!localUser) return

        const parsed = JSON.parse(localUser)
        const userId = parsed.user_id || parsed.id

        const res = await getUser(userId)
        console.log(res)
        setUser(res)
        setFormData({
          firstName: res.first_name || "",
          lastName: res.last_name || "",
          mobile: res.phone || "",
          dob: res.date_of_birth ? res.date_of_birth.split("T")[0] : "",
          gender: res.gender || "",
          email: res.email || "",
          avatar: res.avatar_url ? res.avatar_url : null,
        })
      } catch (err) {
        console.error("Failed to fetch user", err)
        showDialog("Error", "Failed to fetch user data")
      }
    }

    fetchUser()
  }, [])

  const showDialog = (title: string, message: string) => {
    setDialogTitle(title)
    setDialogMessage(message)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!user || !formData) return

    if (!formData.firstName.trim()) {
      return
    }

    if (!formData.lastName.trim()) {
      return
    }

    if (!/^\d{11}$/.test(formData.mobile)) {
      return
    }

    try {
      setLoading(true)
      const dob = new Date(formData.dob)
      const dobStr = `${dob.getFullYear()}-${String(dob.getMonth() + 1).padStart(2, "0")}-${String(dob.getDate()).padStart(2, "0")}`
      const data = new FormData()
      data.append("first_name", formData.firstName)
      data.append("last_name", formData.lastName)
      data.append("email", formData.email)
      data.append("phone", formData.mobile)
      data.append("date_of_birth", dobStr)
      data.append("gender", formData.gender)
      data.append("role", user.role)
      data.append("is_active", user.is_active?.toString() ?? "true")

      if (formData.avatar instanceof File) {
        data.append("avatar", formData.avatar)
      } else if (typeof formData.avatar === "string") {
        data.append("avatar_url", formData.avatar)
      }

      const res = await updateUser(user.user_id, data)
      const updatedUser = res

      setUser(updatedUser)
      setFormData({
        firstName: updatedUser.first_name || "",
        lastName: updatedUser.last_name || "",
        mobile: updatedUser.phone || "",
        dob: updatedUser.date_of_birth || "",
        gender: updatedUser.gender || "",
        email: updatedUser.email || "",
        avatar: updatedUser.avatar_url || "",
      })

      setIsEditing(false)
      toast({
        title: "Success",
        description: "Profile has been updated successfully.",
      });
    } catch (err) {
      console.error("Update failed", err)
      toast({
        title: "Failed",
        description: "Falied to update profile.",
      });
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (!user) return
    setFormData({
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      mobile: user.phone || "",
      dob: user.date_of_birth || "",
      gender: user.gender || "",
      email: user.email || "",
      avatar: user.avatar_url || "",
    })
    setIsEditing(false)
  }

  if (!formData) return <div>Loading...</div>

  return (
    <>
      <div className="flex flex-col p-6 rounded-lg bg-white min-h-[505px]">
        <h2 className="text-black text-2xl font-bold mb-1">Basic Information</h2>

        {isEditing ? (
          <BasicInfoEdit
            data={formData}
            setData={setFormData}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={loading}
          />
        ) : (
          <BasicInfoView
            data={formData}
            onEdit={() => setIsEditing(true)}
          />
        )}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default BasicInfo
