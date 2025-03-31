import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

interface Props {
    label: string,
    info: string
    onToggle: () => void
}

export default function Toggle(props: Props) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="mt-4 mb-2 w-1/5 flex-col">
      <div className="flex justify-start">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{props.label}</span>
      </div>
      <div className="flex justify-center items-center">
        <div className="flex justify-end basis-1/2">
          <label htmlFor="toggle" className="relative inline-flex cursor-pointer items-center text-sm font-medium text-gray-700 dark:text-gray-200">
            <input type="checkbox" id="toggle" className="peer sr-only" onClick={props.onToggle} />
            <div
              className="h-6 w-11 rounded-full bg-gray-100 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] hover:bg-gray-200 peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-disabled:cursor-not-allowed peer-disabled:bg-gray-100 peer-disabled:after:bg-gray-50">
            </div>
          </label>
        </div>
        <div 
          className="relative flex justify-end basis-1/2"
          >
          <InformationCircleIcon
            width={30}
            onMouseEnter={() => {
              setShowPopup(true);
            }}
            onMouseLeave={() => {
              setShowPopup(false);
            }}  
          />
          {showPopup && (
            <div className="absolute top-0 left-full mt-2 w-48 p-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg">
              <p>{props.info}</p>
            </div>
          )}
        </div>
      </div>
    </div>
    )
}