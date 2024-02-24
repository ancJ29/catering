import Autocomplete, {
  AutocompleteProps,
} from "@/components/common/Autocomplete";

type OmitProps = "data" | "onEnter" | "onMatch" | "onClear";
type OmittedAutocompleteProps = Omit<AutocompleteProps, OmitProps>;
type AutocompleteForFilterDataProps = OmittedAutocompleteProps & {
  data?: string[];
  onReload: (keyword?: string) => void;
};

const AutocompleteForFilterData = ({
  data = [],
  onReload,
}: AutocompleteForFilterDataProps) => {
  return (
    <Autocomplete
      data={data}
      onEnter={onReload}
      onMatch={onReload}
      onClear={onReload}
    />
  );
};

export default AutocompleteForFilterData;
