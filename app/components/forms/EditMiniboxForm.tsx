import { GiftBoxValues } from "@/(routes)/dashboard/(gifter_dashboard)/gifter/gift-boxes/[box_id]/setup/page";

const EditMiniboxForm = ({ onPrev, onNext, data }: {
    onPrev: (data: GiftBoxValues) => void,
    onNext: (data: GiftBoxValues, final: boolean) => void,
    data: GiftBoxValues
}) => {
    return (
        <div>hi</div>
    )
}

export default EditMiniboxForm;