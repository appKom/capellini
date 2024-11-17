import PhoneInput from "react-phone-input-2";
import { useTheme } from "../../lib/hooks/useTheme";

interface Props {
  updateInputValues: Function;
  label: string;
  defaultValue?: string;
}

const CustomPhoneInput = (props: Props) => {
  const theme = useTheme();

  const inputStyle = {
    width: "100%",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    backgroundColor: "transparent",
    color: theme === "dark" ? "#fff" : "#000",
    borderColor: theme === "dark" ? "#4b5563" : "#d1d5db",
  };

  const dropdownStyle = {
    backgroundColor: theme === "dark" ? "#202c34" : "#fff",
    color: theme === "dark" ? "#fff" : "#000",
    borderColor: theme === "dark" ? "#4b5563" : "d1d5db",
  };

  return (
    <div className="w-full max-w-xs pb-2 mx-auto my-6">
      <div className="relative">
        <label className="absolute z-10 px-1 text-xs text-gray-500 transition bg-white -top-2 left-2 dark:bg-gray-900 dark:text-gray-200">
          Telefonnummer
        </label>
        <PhoneInput
          country="no"
          inputStyle={inputStyle}
          dropdownStyle={dropdownStyle}
          value={props.defaultValue}
          onChange={(text) => props.updateInputValues(text)}
        />
      </div>
    </div>
  );
};

export default CustomPhoneInput;
