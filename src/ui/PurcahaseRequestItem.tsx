// styles.ts

import { useState } from "react";
import styled from "styled-components";
import FormRow from "./FormRow";
import Row from "./Row";
import Textarea from "./TextArea";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const StyledPurchaseItem = styled.div`
  padding: 5%;
  border: 1px solid;
  margin-bottom: 3%;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const RemoveButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

// DynamicForm.tsx

interface FormValues {
  groups: {
    description: string;
    frequency: string;
    quantity: string;
    unit: string;
    unitCost: string;
    total: string;
  }[];
}

const DynamicForm: React.FC = ({ register, errors }: any) => {
  const [formValues, setFormValues] = useState<FormValues>({
    groups: [
      {
        description: "",
        frequency: "",
        quantity: "",
        unit: "",
        unitCost: "",
        total: "",
      },
    ],
  });

  const handleChange = (
    groupIndex: number,
    fieldName: string,
    value: string
  ) => {
    const updatedGroups = formValues.groups.map((group, index) =>
      index === groupIndex ? { ...group, [fieldName]: value } : group
    );
    setFormValues({ groups: updatedGroups });
  };

  const addGroup = () => {
    setFormValues((prevValues) => ({
      groups: [
        ...prevValues.groups,
        {
          description: "",
          frequency: "",
          quantity: "",
          unit: "",
          unitCost: "",
          total: "",
        },
      ],
    }));
  };

  const removeGroup = (index: number) => {
    setFormValues((prevValues) => ({
      groups: prevValues.groups.filter((_, i) => i !== index),
    }));
  };

  return (
    <FormContainer>
      {formValues.groups.map((group, index) => (
        <StyledPurchaseItem key={index}>
          <Row>
            <FormRow
              label="Description *"
              type="large"
              error={errors?.description?.message}
            >
              <Textarea
                placeholder=""
                id="description"
                {...register("description", {
                  required: "This field is required",
                })}
              />
            </FormRow>
          </Row>

          <Row>
            <FormRow label="Frequency" type="small">
              <Input
                type="number"
                min="0"
                max="100"
                step=".1"
                // value={vat || ""}
                placeholder=""
                id="frequency"
                // {...register("frequency", { min: 0, max: 100 })}
                onChange={(e: any) =>
                  handleChange(index, "frequency", e.target.value)
                }
              />
            </FormRow>
            <FormRow label="Quantity *" type="small">
              <Input
                type="number"
                min="0"
                step=".1"
                // value={wht || ""}
                placeholder=""
                id="quantity"
                // {...register("quantity", { min: 0, max: 100 })}
                onChange={(e: any) =>
                  handleChange(index, "quantity", e.target.value)
                }
              />
            </FormRow>
            <FormRow label="Unit" type="small">
              <Input
                type="text"
                min="0"
                max="100"
                step=".1"
                // value={devLevy || ""}
                placeholder=""
                id="unit"
                // {...register("unit", { min: 0, max: 100 })}
                onChange={(e: any) =>
                  handleChange(index, "unit", e.target.value)
                }
              />
            </FormRow>
          </Row>
          <Row>
            <FormRow
              label="Unit Cost (₦) *"
              type="medium"
              // error={errors?.grossAmount?.message}
            >
              <Input
                type="number"
                min="0"
                // value={grossAmount || ""}
                placeholder="123..."
                id="unitCost"
                // {...register("unitCost", {
                //   required: "This field is required",
                // })}
                onChange={(e: any) =>
                  handleChange(index, "unitCost", e.target.value)
                }
              />
            </FormRow>

            <FormRow
              label="Total (₦)*"
              type="medium"
              error={errors?.total?.message}
            >
              <Input
                placeholder=""
                id="total"
                // {...register("total", {
                //   required: "This field is required",
                // })}
                onChange={(e: any) =>
                  handleChange(index, "total", e.target.value)
                }
              />
            </FormRow>
          </Row>
          {formValues.groups.length > 1 && (
            <RemoveButton type="button" onClick={() => removeGroup(index)}>
              Remove Group
            </RemoveButton>
          )}
        </StyledPurchaseItem>
      ))}
      <Button type="button" onClick={addGroup}>
        Add Group
      </Button>
    </FormContainer>
  );
};

export default DynamicForm;
