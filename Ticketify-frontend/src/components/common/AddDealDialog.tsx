import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import DealForm from "./DealForm"

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

export default function AddDealDialog({ open, onClose, onSubmit }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Deal</DialogTitle>
        </DialogHeader>

        <DealForm onSave={onSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
}
