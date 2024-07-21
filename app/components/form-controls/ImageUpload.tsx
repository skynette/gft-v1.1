'use client'

import { ImagePlus, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { CldUploadWidget } from "next-cloudinary"
import { Button } from "../ui/button"

interface ImageUploadProps {
    disabled?: boolean,
    onChange: (value: string) => void,
    onRemove: (value: string) => void,
    value: string[],
}

const ImageUpload: React.FC<ImageUploadProps> = ({ disabled, onChange, onRemove, value }) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const onUpload = (result: any) => {
        onChange(result.info.secure_url)
    }

    if (!isMounted) {
        return null
    }

    return (
        <div>
            <div className="mb-2 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onRemove(url)} variant={'destructive'} size={'icon'}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="image"
                            src={url}
                        />
                    </div>
                ))}

            </div>
            <CldUploadWidget onUpload={onUpload} uploadPreset="i8es1cwg">
                {({ open }) => {
                    const onClick = () => {
                        open()
                    }
                    return (
                        <Button
                            type="button"
                            onClick={onClick}
                            disabled={disabled}
                            variant="secondary"
                        >
                            <ImagePlus className="h-4 w-4 mr-1" />
                            Upload an image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}


export default ImageUpload