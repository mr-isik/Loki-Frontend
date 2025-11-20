import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const LoopForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const [dataSource, setDataSource] = useState(nodeData.dataSource || "");
  const [loopType, setLoopType] = useState(nodeData.loopType || "array");
  const [itemVariable, setItemVariable] = useState(
    nodeData.itemVariable || "item"
  );
  const [indexVariable, setIndexVariable] = useState(
    nodeData.indexVariable || "index"
  );
  const [maxIterations, setMaxIterations] = useState(
    nodeData.maxIterations || ""
  );

  const handleSave = () => {
    onSave({
      dataSource,
      loopType,
      itemVariable,
      indexVariable,
      maxIterations: maxIterations ? parseInt(maxIterations) : undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="loopType">Loop Type</Label>
        <Select value={loopType} onValueChange={setLoopType}>
          <SelectTrigger id="loopType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="array">Array/List</SelectItem>
            <SelectItem value="object">Object Keys</SelectItem>
            <SelectItem value="range">Number Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="dataSource">Data Source</Label>
        <Input
          id="dataSource"
          placeholder="e.g., data.items or response.users"
          value={dataSource}
          onChange={(e) => setDataSource(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Path to the data you want to loop over
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="itemVariable">Item Variable Name</Label>
          <Input
            id="itemVariable"
            placeholder="item"
            value={itemVariable}
            onChange={(e) => setItemVariable(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="indexVariable">Index Variable Name</Label>
          <Input
            id="indexVariable"
            placeholder="index"
            value={indexVariable}
            onChange={(e) => setIndexVariable(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="maxIterations">Max Iterations (Optional)</Label>
        <Input
          id="maxIterations"
          type="number"
          placeholder="Leave empty for unlimited"
          value={maxIterations}
          onChange={(e) => setMaxIterations(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Safety limit to prevent infinite loops
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Configuration</Button>
      </div>
    </div>
  );
};
