import { useState } from "react";
import Card from "react-bootstrap/Card";
import "./SearchWidget.css";
import { Container, Button, ToggleButton } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
//import { GlobalStoreContext } from "../../contexts/GlobalStoreContext";

/// Component which displays a text field for search data entry
/// and sorting radios. Will likely need state setters from the
/// gallery page passed to it as props
export default function SearchWidget(props) {
  //const { handleFetchUsers } = useContext(GlobalStoreContext);
  const [term, setTerm] = useState("");
  const [radioValue, setRadioValue] = useState("date");

  const radios = [
    { name: "Date", value: "date" },
    { name: "Rating", value: "rating" },
  ];

  const handleButtonClick = () => {
    props.setSearchTerm(term);
  };

  return (
    <Card style={{ width: "350px" }}>
      <Card.Body style={{ backgroundColor: "#0C0D34", color: "white" }}>
        <Card.Title>Search & Sort</Card.Title>
      </Card.Body>
      <Container style={{ padding: "20px" }}>
        {/*TODO: This will need an OnClick handler */}
        <Button id="searchButton" onClick={handleButtonClick}>
          <BsSearch />
        </Button>
        <input
          className="bar"
          placeholder="Search for maps"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        ></input>

        <h3>Sort by</h3>

        {radios.map((radio, idx) => (
          <ToggleButton
            className="button"
            key={idx}
            id={`radio-${idx}`}
            type="radio"
            name="radio"
            value={radio.value}
            checked={radioValue === radio.value}
            onChange={(e) => {
              setRadioValue(e.currentTarget.value);
              props.setSortTerm(e.currentTarget.value);
            }}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </Container>
    </Card>
  );
}
