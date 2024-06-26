'use client'

import { useEffect, useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "../ui/button"

interface AlertModalProps {
    isOpen: boolean,         // Determines if the modal is open
    onClose: () => void,     // Function to call when the modal should be closed
    onConfirm: () => void,   // Function to call when the action is confirmed
    loading: boolean,        // Boolean to indicate if an action is loading
}

/**
 * AlertModal Component
 * 
 * A modal component that prompts the user to confirm or cancel an action.
 * The modal displays a title and description and provides "Cancel" and "Continue" buttons.
 * 
 * @param {boolean} isOpen - Indicates whether the modal is currently open.
 * @param {Function} onClose - Callback function to handle closing the modal.
 * @param {Function} onConfirm - Callback function to handle confirming the action.
 * @param {boolean} loading - Indicates whether an action is in progress, disabling the buttons if true.
 */
export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, onConfirm, loading }) => {
    const [isMounted, setIsMounted] = useState(false)

    // Set isMounted to true after the component is mounted
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Return null if the component is not mounted to avoid server-side rendering issues
    if (!isMounted) return null

    return (
        <Modal
            title="Are you sure?" // Modal title
            description="This action cannot be undone." // Modal description
            isOpen={isOpen} // Pass isOpen prop to Modal to control its visibility
            onClose={onClose} // Pass onClose prop to Modal to handle closing
        >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant={'outline'} onClick={onClose} type="button">Cancel</Button>
                <Button disabled={loading} variant={'destructive'} onClick={onConfirm} type="button">Continue</Button>
            </div>
        </Modal>
    )
}
