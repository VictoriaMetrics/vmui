import React, {FC, useMemo} from "react";
import {InstantMetricResult} from "../../../api/types";
import {Box, Button} from "@material-ui/core";
import {useSnack} from "../../../contexts/Snackbar";

export interface JsonViewProps {
  data: InstantMetricResult[];
}

const JsonView: FC<JsonViewProps> = ({data}) => {
  const {showInfoMessage} = useSnack();

  const formattedJson = useMemo(() => JSON.stringify(data, null, 2), [data]);

  return (
    <Box position="relative">
      <Box flexDirection="column" display="flex"
        style={{
          position: "absolute",
          top: "0",
          right: "0"
        }}>
        <Button variant="outlined" onClick={() => {
          navigator.clipboard.writeText(formattedJson);
          showInfoMessage("Formatted JSON has been copied");
        }}>Copy JSON</Button>
      </Box>
      <pre>{formattedJson}</pre>
    </Box>
  );
};

export default JsonView;
