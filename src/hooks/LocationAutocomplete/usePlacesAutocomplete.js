import { useEffect } from "react";

export default function usePlacesAutocomplete(inputRef, onSelect) {
  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["(cities)"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place?.formatted_address) return;

      onSelect(place.formatted_address, place);
    });
  }, []);
}
