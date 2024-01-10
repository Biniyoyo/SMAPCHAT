import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { HexColorPicker } from "react-colorful";
import "./ColorWidget.css";

export default function ColorWidget(props) {
  const [active, setActive] = useState(false);
  const [tempColor, setTempColor] = useState(props.color);

  const picker = active ? (
    <>
      <HexColorPicker color={props.color} onChange={setTempColor} />
      <Button
        onClick={() => {
          props.onChange(tempColor);
          setActive(false);
        }}
      >
        Confirm
      </Button>
    </>
  ) : (
    <></>
  );

  return (
    <>
      <Container onClick={() => setActive(!active)} className="widget">
        {props.text ?? "Color"}
        <div className="preview" style={{ backgroundColor: props.color }}></div>
      </Container>
      {picker}
    </>
  );
}
