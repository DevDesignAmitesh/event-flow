interface InputBoxProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
}

const InputBox = ({ label, type, value, onChange }: InputBoxProps) => {
  return (
    <div className="flex flex-col justify-start items-start gap-2 w-full">
      <p>{label}</p>
      <input
        type={type}
        placeholder={`Enter your ${label}`}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-neutral-500 rounded-md"
      />
    </div>
  );
};

export default InputBox;
