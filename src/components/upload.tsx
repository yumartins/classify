import type { PropsWithChildren } from "react"
import { Trash } from "lucide-react"
import ImageUploading, {
  type ErrorsType,
  type ImageListType,
  type ImageUploadingPropsType,
} from "react-images-uploading"

type DragProps = {
  onDrop: (e: any) => void
  onDragOver: (e: any) => void
  onDragEnter: (e: any) => void
  onDragLeave: (e: any) => void
  onDragStart: (e: any) => void
}

export interface UploadingProps {
  errors: ErrorsType
  imageList: ImageListType
  dragProps: DragProps
  isDragging: boolean
  onImageUpload: () => void
  onImageUpdate: (index: number) => void
  onImageRemove: (index: number) => void
  onImageRemoveAll: () => void
}

interface UploadProps
  extends PropsWithChildren,
    Omit<ImageUploadingPropsType, "children"> {
  label: string
}

export default function Upload({
  label,
  children,
  multiple,
  ...rest
}: UploadProps) {
  return (
    <ImageUploading
      {...rest}
      multiple={multiple}
      maxNumber={10}
      acceptType={["jpg", "png"]}
      dataURLKey="data_url"
    >
      {({
        dragProps,
        imageList,
        isDragging,
        onImageUpload,
        onImageRemove,
        onImageRemoveAll,
      }: UploadingProps) => (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-600">{label}</p>

              {imageList.length > 0 && (
                <button
                  onClick={onImageRemoveAll}
                  className="text-xs bg-transparent text-red-500"
                >
                  {multiple ? "Remover imagens" : "Remover imagem"}
                </button>
              )}
            </div>

            <button
              {...dragProps}
              type="button"
              onClick={onImageUpload}
              className={`flex px-4 py-2 text-gray-400 text-sm cursor-pointer bg-white rounded-lg transition-all duration-300 ease-in-out border border-dashed ${
                isDragging
                  ? "border-blue-500"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              Clique ou arraste os arquivos aqui
            </button>
          </div>

          {children}

          {imageList.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {imageList.map((image, index) => (
                <div key={index} className="flex relative w-full h-32">
                  <img
                    src={image.data_url}
                    alt=""
                    className="w-full object-cover rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() => onImageRemove(index)}
                    className="w-10 h-10 absolute top-2 right-2 rounded-full bg-white flex items-center justify-center text-red-500 border border-solid border-gray-100 transition-all duration-300 ease-in-out hover:border-gray-200"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ImageUploading>
  )
}
