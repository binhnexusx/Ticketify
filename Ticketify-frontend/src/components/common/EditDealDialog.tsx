import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import DealForm from "./DealForm"

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  deal: any
}

export default function EditDealDialog({ open, onClose, onSubmit, deal }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="hide-dialog-close">
        <DialogHeader>
          <DialogTitle>Edit Deal</DialogTitle>
        </DialogHeader>
        <DealForm initialData={deal} onSave={onSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
}

