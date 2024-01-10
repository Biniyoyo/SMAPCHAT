import { useEffect, useRef, useState } from "react";

export default function DebouncedInput(props) {
  const [value, setValue] = useState(props.value);
  const [editing, setEditing] = useState(false);
  const timer = useRef(null);

  if (!editing && value !== props.value) {
    console.log("Updating based on state");
    setValue(props.value);
  }

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (editing) {
        props.onChange(value);
        setEditing(false);
      }
    }, 500);
  });

  return (
    <input
      className={props.className}
      placeholder={props.placeholder}
      type={props.type}
      value={value}
      onChange={(val) => {
        console.log("Changing!");
        setValue(val.target.value);
        setEditing(true);
      }}
    ></input>
  );
}
