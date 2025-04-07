import React from "react";
import Select from "react-select";

const YachtSelector = ({ yachts, onSelect }) => {
  const yachtOptions = yachts.map((yacht) => ({
    value: yacht._id,
    label: yacht.title,
    description: yacht.short_description,
    image: yacht.images?.[0]?.imageUrl || "placeholder.png",
  }));

  return (
    <Select
      options={yachtOptions}
      onChange={onSelect}
      placeholder="Select a yacht"
      className="dropdown"
      styles={{
        control: (provided) => ({
          ...provided,
          minWidth: "200px",
          width: "auto",
          zIndex: 2,
        }),
        menu: (provided) => ({
          ...provided,
          zIndex: 3,
          marginTop: 0,
        }),
        menuPortal: (provided) => ({
          ...provided,
          zIndex: 9999,
        }),
      }}
      menuPortalTarget={document.body}
    />
  );
};

export default YachtSelector;
