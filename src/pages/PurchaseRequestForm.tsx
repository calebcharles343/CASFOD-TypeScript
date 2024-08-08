import React, { useEffect, useState } from "react";
import FormRow from "../ui/FormRow";
import Input from "../ui/Input";

import Row from "../ui/Row";
import Form from "../ui/Form";
import Button from "../ui/Button";
import { FaPlus } from "react-icons/fa6";
import styled from "styled-components";
import { FormValues2 } from "../interfaces";
import { useForm } from "react-hook-form";

interface ItemGroup {
  discription: string;
  frequency: string;
  quantity: string;
  unit: string;
  unitCost: string;
  total: any;
}

const StyledPurchaseItem = styled.div`
  width: 80%;
  padding: 5%;
  border: 1px solid;
  margin-bottom: 3%;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 400px;
  overflow-y: scroll;
`;

const FormWithGroups: React.FC = () => {
  /////////////////////
  //ITEM STATE
  /////////////////////
  const [intemGroups, setItemGroups] = useState<ItemGroup[]>([]);
  const { handleSubmit, formState, register, reset } = useForm();
  const { errors } = formState;

  // Handle change for individual inputs
  const handleChange = (
    groupIndex: number,
    inputName: keyof ItemGroup,
    value: string
  ) => {
    const updatedGroups = [...intemGroups];
    updatedGroups[groupIndex] = {
      ...updatedGroups[groupIndex],
      [inputName]: value,
    };

    setItemGroups(updatedGroups);
  };

  // Add a new group to the list
  const additems = () => {
    setItemGroups([
      ...intemGroups,
      {
        discription: "",
        frequency: "",
        quantity: "",
        unit: "",
        unitCost: "",
        total: "",
      },
    ]);
  };

  const removeGroup = (index: number) => {
    const filter = intemGroups.filter((_, i) => i !== index);
    setItemGroups(filter);
  };

  // Update input3 whenever input1 or input2 changes
  useEffect(() => {
    const updatedGroups = intemGroups.map((group) => ({
      ...group,
      total: (
        (parseFloat(group.frequency) || 1) *
        (parseFloat(group.quantity) || 1) *
        (parseFloat(group.unitCost) || 0)
      ).toFixed(2),
    }));
    setItemGroups(updatedGroups);
  }, [
    intemGroups.map((g) => g.frequency).join(","),
    intemGroups.map((g) => g.quantity).join(","),
    intemGroups.map((g) => g.unitCost).join(","),
  ]);

  ///////////////////////////////////////////////////////////
  //form submission
  ///////////////////////////////////////////////////////////

  async function formSubmit(data: Partial<FormValues2>) {
    const newData = { data, ...intemGroups };

    console.log(newData);
    reset();
  }

  ///////////////////////////////////////////////////////////
  return (
    <Form onSubmit={handleSubmit(formSubmit)}>
      {/* Static inputs */}
      <Row>
        <FormRow label="Date" type="small">
          <Input
            type="date"
            id="date"
            {...register("date")}
            // onChange={handleDate}
          />
        </FormRow>
        <FormRow label="Department *">
          <Input
            type="text"
            id="department"
            required
            {...register("department")}
          />
        </FormRow>
      </Row>

      <Row>
        <FormRow
          label="Suggested supplier *"
          error={errors?.payingStation?.message}
        >
          <Input
            placeholder=""
            id="suggestedSupplier"
            required
            {...register("suggestedSupplier")}
          />
        </FormRow>
        <FormRow label="Required by *">
          <Input
            placeholder=""
            id="RequiredBy"
            required
            {...register("RequiredBy")}
          />
        </FormRow>
      </Row>
      <Row>
        <FormRow label="Address *" error={errors?.payingStation?.message}>
          <Input
            placeholder=""
            id="address"
            required
            {...register("address")}
          />
        </FormRow>
        <FormRow label="Final delivery point *">
          <Input
            placeholder=""
            id="finalDeliveryPoint"
            required
            {...register("finalDeliveryPoint")}
          />
        </FormRow>
      </Row>
      <Row>
        <FormRow label="City *">
          <Input placeholder="" id="city" required {...register("city")} />
        </FormRow>
        <FormRow
          label="Period of Activity *"
          error={errors?.payingStation?.message}
        >
          <Input
            placeholder=""
            id="periodOfActivity"
            required
            {...register("periodOfActivity")}
          />
        </FormRow>
      </Row>

      <Row>
        <FormRow
          label="Activity Description"
          type="large"
          error={errors?.being?.message}
        >
          <Input
            size="wide"
            placeholder=""
            id="activityDescription"
            {...register("activityDescription")}
          />
        </FormRow>
      </Row>

      {/* //////////////////////////////////////////////////////// */}
      {/* //////////////////////////////////////////////////////// */}
      {/* //////////////////////////////////////////////////////// */}
      {/* Dynamic intemGroups */}

      <ItemContainer>
        {intemGroups.map((group, index) => (
          <StyledPurchaseItem key={index}>
            <h4>ITEM {index + 1}</h4>

            <Row>
              <FormRow label="Discription *" type="large">
                <Input
                  placeholder=""
                  size="wide"
                  value={group.discription}
                  required
                  title="This field is required"
                  onChange={(e: any) =>
                    handleChange(index, "discription", e.target.value)
                  }
                />
              </FormRow>
            </Row>

            <Row>
              <FormRow label="Frequency" type="small">
                <Input
                  placeholder=""
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={group.frequency}
                  onChange={(e: any) => {
                    handleChange(index, "frequency", e.target.value);
                    // setFrequency(e.target.value);
                  }}
                />
              </FormRow>
              <FormRow label="Quantity *" type="small">
                <Input
                  placeholder=""
                  type="number"
                  min="0"
                  max="100"
                  value={group.quantity}
                  onChange={(e: any) => {
                    handleChange(index, "quantity", e.target.value);
                    // setQuantiy(e.target.value);
                  }}
                />
              </FormRow>
              <FormRow label="Unit" type="small">
                <Input
                  min="0"
                  max="100"
                  value={group.unit}
                  placeholder=""
                  onChange={(e: any) => {
                    handleChange(index, "unit", e.target.value);
                    // setUnit(e.target.value);
                  }}
                />
              </FormRow>
            </Row>
            <Row>
              <FormRow label="Unit Cost (₦) *" type="medium">
                <Input
                  type="number"
                  min="0"
                  value={group.unitCost}
                  placeholder="123..."
                  onChange={(e: any) => {
                    handleChange(index, "unitCost", e.target.value);
                    // setUnitCost(e.target.value);
                  }}
                />
              </FormRow>

              <FormRow label="Total (₦)*" type="medium">
                <Input
                  placeholder=""
                  type="number"
                  value={group.total}
                  onChange={(e: any) =>
                    handleChange(index, "total", e.target.value)
                  }
                />
              </FormRow>
            </Row>
            <button type="submit" onClick={() => removeGroup(index)}>
              Delete Item {index + 1}
            </button>
          </StyledPurchaseItem>
        ))}
      </ItemContainer>

      {/* //////////////////////////////////////////////////////// */}
      {/* //////////////////////////////////////////////////////// */}
      {/* //////////////////////////////////////////////////////// */}

      {/* <button onClick={() => console.log(intemGroups)}>Commit Item</button> */}

      <Button type="counter" onClick={additems}>
        Add Item
        <FaPlus />
      </Button>
      <span>{intemGroups.length} Added</span>

      <Row>
        <FormRow
          label="Expense Charged To *"
          type="medium"
          error={errors?.netAmount?.message}
        >
          <Input
            type="text"
            required
            id="expenseChargedTo"
            {...register("expenseChargedTo")}
          />
        </FormRow>

        <FormRow label="Acount Code *" type="small">
          <Input
            type="text"
            min="0"
            max="100"
            step=".1"
            required
            placeholder=""
            id="acountCode"
            {...register("acountCode", { min: 0, max: 100 })}
            // onChange={handleDevLevy}
          />
        </FormRow>
      </Row>

      <Row>
        <FormRow label="Requested By *" type="medium">
          <Input
            type="text"
            placeholder=""
            id="requestedBy"
            required
            {...register("requestedBy")}
          />
        </FormRow>
      </Row>
      <Row>
        <FormRow label="Approved By *" type="medium">
          <Input
            type="text"
            placeholder=""
            id="approvedBy"
            required
            {...register("approvedBy")}
          />
        </FormRow>
      </Row>

      <Button size="medium">Download</Button>
    </Form>
  );
};

export default FormWithGroups;
