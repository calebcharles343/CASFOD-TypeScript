import ExcelJS from "exceljs";

import React, { useEffect, useState } from "react";
import FormRow from "../ui/FormRow";
import Input from "../ui/Input";

import Row from "../ui/Row";
import Form from "../ui/Form";
import Button from "../ui/Button";
import { FaPlus } from "react-icons/fa6";
import styled from "styled-components";
import { FormValues2, ItemGroup } from "../interfaces";
import { useForm } from "react-hook-form";
import { base64String } from "../services/logo64";

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

const ItemDeleteButton = styled.button`
  text-align: center;
  color: #fff;
  background-color: #f03e3e;
  margin-right: 2%;
  border: none;
  padding: 3px 5px;
  border-radius: 5px;
  transition: all 0.2s;

  &:hover {
    background-color: #e03131;
  }
`;

const ItemDoneButton = styled.button`
  text-align: center;
  color: #212529;
  margin-right: 2%;
  border: none;
  padding: 3px 5px;
  border-radius: 5px;
  transition: all 0.2s;
  background-color: #4c6ef5;

  &:hover {
    background-color: #748ffc;
  }

  color: #fff;
`;

const FormWithGroups: React.FC = () => {
  /////////////////////
  //ITEM STATE
  /////////////////////
  const [itemGroup, setItemGroups] = useState<ItemGroup[]>([]);
  const { handleSubmit, formState, register, reset } = useForm();
  const { errors } = formState;

  // Handle change for individual inputs
  const handleChange = (
    groupIndex: number,
    inputName: keyof ItemGroup,
    value: string
  ) => {
    const updatedGroups = [...itemGroup];
    updatedGroups[groupIndex] = {
      ...updatedGroups[groupIndex],
      [inputName]: value,
    };

    setItemGroups(updatedGroups);
  };

  // Add a new group to the list
  const additems = () => {
    setItemGroups([
      ...itemGroup,
      {
        description: "",
        frequency: "",
        quantity: "",
        unit: "",
        unitCost: "",
        total: "",
        disabled: false,
      },
    ]);
  };

  const removeGroup = (index: number) => {
    const filter = itemGroup.filter((_, i) => i !== index);
    setItemGroups(filter);
  };

  const handledEdit = (index: number) => {
    setItemGroups(
      itemGroup.map((group, i) =>
        i === index ? { ...group, disabled: !group.disabled } : group
      )
    );
  };

  useEffect(() => {
    const updatedGroups = itemGroup.map((group) => ({
      ...group,
      total: (
        (parseFloat(group.frequency) || 1) *
        (parseFloat(group.quantity) || 1) *
        (parseFloat(group.unitCost) || 0)
      ).toFixed(2),
    }));
    setItemGroups(updatedGroups);
  }, [
    itemGroup.map((g) => g.frequency).join(","),
    itemGroup.map((g) => g.quantity).join(","),
    itemGroup.map((g) => g.unitCost).join(","),
  ]);

  ///////////////////////////////////////////////////////////
  //form submission
  ///////////////////////////////////////////////////////////

  async function formSubmit(data: Partial<FormValues2>) {
    const newData = { data, ...itemGroup };

    console.log(newData);
    console.log(itemGroup);

    try {
      if (newData) {
        const workbook = new ExcelJS.Workbook();
        ////////////////////////////////////////
        //EXCELSHEET METADATA
        ////////////////////////////////////////
        workbook.creator = newData.data.requestedBy!;
        workbook.lastModifiedBy = newData.data.requestedBy!;
        workbook.created = new Date();

        // Create Worksheet
        const worksheet = workbook.addWorksheet("Purchase Request");

        //ADD LOGO STEP 2
        const imageId1 = workbook.addImage({
          base64: base64String,
          extension: "png",
        });

        worksheet.addImage(imageId1, {
          tl: { col: 0.5, row: 1 },
          ext: { width: 250, height: 100 },
        });

        //////////////////////////////////////////
        //HEADER
        //////////////////////////////////////////
        worksheet.mergeCells("A1:E8"); //#logoCell
        worksheet.mergeCells("F2:L4"); //#headerCell
        worksheet.mergeCells("F5:L8"); //#headerCell

        const titleCell = worksheet.getCell("F2");
        titleCell.value = "UNIQUE CARE AND SUPPORT FOUNDATION (CASFOD)";
        titleCell.alignment = { vertical: "middle", horizontal: "center" };
        titleCell.font = { bold: true, size: 14 };

        const formTitleCell = worksheet.getCell("F5");
        formTitleCell.value = "PURCHASE REQUEST FORM";
        formTitleCell.alignment = { vertical: "top", horizontal: "center" };
        formTitleCell.font = { bold: true, size: 12 };

        //////////////////////////////////////////
        //TABLE HEADING
        //////////////////////////////////////////
        worksheet.mergeCells("A9:B9"); //#dateCell
        worksheet.mergeCells("C9:F9"); //#dateCellValue
        worksheet.mergeCells("A10:B10"); //#suggestedSupplier
        worksheet.mergeCells("C10:F10"); //#suggestedSupplierValue
        worksheet.mergeCells("A11:B11"); //#address
        worksheet.mergeCells("C11:F11"); //#addressValue
        worksheet.mergeCells("A12:B12"); //#city
        worksheet.mergeCells("C12:F12"); //#cityValue
        worksheet.mergeCells("A13:B13"); //#activityDescription
        worksheet.mergeCells("C13:L13"); //#activityDescriptionValue

        worksheet.mergeCells("G9:H9"); //#department
        worksheet.mergeCells("I9:L9"); //#departmentValue
        worksheet.mergeCells("G10:H10"); //#requisitionedBy
        worksheet.mergeCells("I10:L10"); //#requisitionedByValue
        worksheet.mergeCells("G11:H11"); //#finalDeliveryPoint
        worksheet.mergeCells("I11:L11"); //#finalDeliveryPointValue
        worksheet.mergeCells("G12:H12"); //#periodOfActivity
        worksheet.mergeCells("I12:L12"); //#periodOfActivity

        // DATE
        const dateCell = worksheet.getCell("A9");
        dateCell.value = "DATE";
        dateCell.alignment = { vertical: "middle", horizontal: "left" };
        dateCell.font = { bold: true, size: 12 };

        const dateValue = worksheet.getCell("C9");
        dateValue.value = newData.data.date;
        dateValue.font = { size: 12 };

        // SUGGESTED SUPPLIER
        const suggestedSupplier = worksheet.getCell("A10");
        suggestedSupplier.value = "SUGGESTED SUPPLIER";
        suggestedSupplier.alignment = {
          vertical: "middle",
          horizontal: "left",
        };
        suggestedSupplier.font = { bold: true, size: 12 };

        const suggestedSupplierValue = worksheet.getCell("C10");
        suggestedSupplierValue.value = newData.data.suggestedSupplier;
        suggestedSupplierValue.font = { size: 12 };

        // ADDRESS
        const address = worksheet.getCell("A11");
        address.value = "ADDRESS";
        address.alignment = { vertical: "middle", horizontal: "left" };
        address.font = { bold: true, size: 12 };

        const addressValue = worksheet.getCell("C11");
        addressValue.value = newData.data.address;
        addressValue.font = { size: 12 };

        // CITY
        const city = worksheet.getCell("A12");
        city.value = "CITY";
        city.alignment = { vertical: "middle", horizontal: "left" };
        city.font = { bold: true, size: 12 };

        const cityValue = worksheet.getCell("C12");
        cityValue.value = newData.data.city;
        cityValue.font = { size: 12 };

        //ACTIVITY DESCRIPTION
        const activityDescription = worksheet.getCell("A13");
        activityDescription.value = "ACTIVITY DESCRIPTION";
        activityDescription.alignment = {
          vertical: "middle",
          horizontal: "left",
        };
        activityDescription.font = { bold: true, size: 12 };

        const activityDescriptionValue = worksheet.getCell("C13");
        activityDescriptionValue.value = newData.data.activityDescription;
        activityDescriptionValue.font = { size: 12 };

        // DEPARTMENT
        const department = worksheet.getCell("G9");
        department.value = "DEPARTMENT";
        department.alignment = { vertical: "middle", horizontal: "left" };
        department.font = { bold: true, size: 12 };

        const departmentValue = worksheet.getCell("I9");
        departmentValue.value = newData.data.department;
        departmentValue.font = { size: 12 };

        // REQUISITIONED BY
        const requisitionedBy = worksheet.getCell("G10");
        requisitionedBy.value = "REQUISITIONED BY";
        requisitionedBy.alignment = {
          vertical: "middle",
          horizontal: "left",
        };
        requisitionedBy.font = { bold: true, size: 12 };

        const requisitionedByValue = worksheet.getCell("I10");
        requisitionedByValue.value = newData.data.requiredBy;
        requisitionedByValue.font = { size: 12 };

        // FINAL DELIVERY POINT
        const finalDeliveryPoint = worksheet.getCell("G11");
        finalDeliveryPoint.value = "FINAL DELIVERY POINT";
        finalDeliveryPoint.alignment = {
          vertical: "middle",
          horizontal: "left",
        };
        finalDeliveryPoint.font = { bold: true, size: 12 };

        const finalDeliveryPointValue = worksheet.getCell("I11");
        finalDeliveryPointValue.value = newData.data.finalDeliveryPoint;
        finalDeliveryPointValue.font = { size: 12 };

        // PERIOD OF ACTIVITY
        const periodOfActivity = worksheet.getCell("G12");
        periodOfActivity.value = "PERIOD OF ACTIVITY";
        periodOfActivity.alignment = {
          vertical: "middle",
          horizontal: "left",
        };
        periodOfActivity.font = { bold: true, size: 12 };

        const periodOfActivityValue = worksheet.getCell("I12");
        periodOfActivityValue.value = newData.data.periodOfActivity;
        periodOfActivityValue.font = { size: 12 };

        ////////////////////////////////////////
        //TABLE
        ////////////////////////////////////////
        worksheet.mergeCells("A14:L14"); //#

        //ITEM
        const item = worksheet.getCell("A15"); //#item
        item.value = "ITEM";
        item.alignment = {
          horizontal: "center",
        };
        item.font = { bold: true };
        const itemCol = worksheet.getColumn("A");
        itemCol.width = 13;

        //DESCRIPTION AND SPECIFICATION
        worksheet.mergeCells("B15:G15"); //#descriptionAndSpecification

        const descriptionAndSpecification = worksheet.getCell("B15");
        descriptionAndSpecification.value = "DESCRIPTION AND SPECIFICATION";
        descriptionAndSpecification.alignment = {
          horizontal: "center",
        };
        descriptionAndSpecification.font = { bold: true };

        //FREQUENCY
        const frequency = worksheet.getCell("H15"); //#frequency
        frequency.value = "FREQUENCY";
        frequency.alignment = {
          horizontal: "center",
        };
        frequency.font = { bold: true };
        const frequencyCol = worksheet.getColumn("H");
        frequencyCol.width = 15;

        //QUANTITY
        const quantity = worksheet.getCell("I15"); //#quantity
        quantity.value = "QUANTITY";
        quantity.alignment = {
          horizontal: "center",
        };
        quantity.font = { bold: true };
        const quantityCol = worksheet.getColumn("I");
        quantityCol.width = 15;

        //UNIT
        const unit = worksheet.getCell("J15"); //#unit
        unit.value = "UNIT";
        unit.alignment = {
          horizontal: "center",
        };
        unit.font = { bold: true };
        const unitCol = worksheet.getColumn("J");
        unitCol.width = 15;

        //UNIT COST
        const unitCost = worksheet.getCell("K15"); //#unitCost
        unitCost.value = "UNIT COST";
        unitCost.alignment = {
          horizontal: "center",
        };
        unitCost.font = { bold: true };
        const unitCostCol = worksheet.getColumn("K");
        unitCostCol.width = 15;

        //TOTAL
        const total = worksheet.getCell("L15"); //#total
        total.value = "TOTAL";
        total.alignment = {
          horizontal: "center",
        };
        total.font = { bold: true };
        const totalCol = worksheet.getColumn("L");
        totalCol.width = 15;

        /////////////////////////////////////////////////////////////////
        // TABLE OF ITEMS
        /////////////////////////////////////////////////////////////////
        itemGroup.forEach((row, i) => {
          worksheet.mergeCells(`B${16 + i}:G${16 + i}`);

          const tableDescription = worksheet.getCell(`B${16 + i}`);
          tableDescription.value = row.description;

          const tableItem = worksheet.getCell(`A${16 + i}`);
          tableItem.value = `${i + 1}`;
          tableItem.font = { size: 12 };

          const tableFrequency = worksheet.getCell(`H${16 + i}`);
          tableFrequency.value = Number(row.frequency);
          tableFrequency.font = { size: 12 };

          const tableQuantity = worksheet.getCell(`I${16 + i}`);
          tableQuantity.value = Number(row.quantity);
          tableQuantity.font = { size: 12 };

          const tableUnit = worksheet.getCell(`J${16 + i}`);
          tableUnit.value = row.unit;
          tableUnit.font = { size: 12 };

          const tableUnitCost = worksheet.getCell(`K${16 + i}`);
          tableUnitCost.value = Number(row.unitCost);
          tableUnitCost.font = { size: 12 };

          const tableTotal = worksheet.getCell(`L${16 + i}`);
          tableTotal.value = Number(row.total);
          tableTotal.font = { size: 12 };

          // worksheet.addRow([
          //   `${i + 1}`,
          //   row.description,
          //   Number(row.frequency),
          //   Number(row.quantity),
          //   row.unit,
          //   Number(row.unitCost),
          //   Number(row.total),
          // ]);
        });

        // TOTAL SUM
        const rowCount = worksheet.rowCount;
        const totalText = worksheet.getCell(`K${[rowCount + 1]}`);
        totalText.value = "TOTAL: (₦)";
        totalText.font = { bold: true, size: 12 };

        const totalSum = worksheet.getCell(`L${[rowCount + 1]}`);
        totalSum.value = itemGroup.reduce(
          (acc, item) => acc + Number(item.total),
          0
        );
        totalSum.font = { bold: true, size: 12 };

        //FOOTER
        worksheet.mergeCells(`A${[rowCount + 2]}:L${[rowCount + 2]}`);
        // Expense Charged To
        worksheet.mergeCells(`B${[rowCount + 3]}:C${[rowCount + 3]}`);
        const chargeExpenseTo = worksheet.getCell(`B${[rowCount + 3]}`);
        chargeExpenseTo.value = "Charge Expense To";
        chargeExpenseTo.font = { bold: true };

        const chargeExpTo = worksheet.getColumn("B");
        chargeExpTo.width = 16;

        worksheet.mergeCells(`D${[rowCount + 3]}:G${[rowCount + 3]}`);
        const expenseChargedToValue = worksheet.getCell(`D${rowCount + 3}`);
        expenseChargedToValue.value = newData.data.expenseChargedTo;
        expenseChargedToValue.border = { bottom: { style: "medium" } };

        // Account Code
        worksheet.mergeCells(`B${[rowCount + 4]}:C${[rowCount + 4]}`);
        const accountCode = worksheet.getCell(`B${[rowCount + 4]}`);
        accountCode.value = "Account Code";
        accountCode.font = { bold: true };

        worksheet.mergeCells(`D${[rowCount + 4]}:G${[rowCount + 4]}`);
        const accountCodeValue = worksheet.getCell(`D${rowCount + 4}`);
        accountCodeValue.value = newData.data.accountCode;
        accountCodeValue.border = { bottom: { style: "medium" } };

        // Requested By
        // worksheet.mergeCells(`B${[rowCount + 2]}:C${[rowCount + 2]}`);
        const requestedBy = worksheet.getCell(`J${[rowCount + 3]}`);
        requestedBy.value = "Request By";
        requestedBy.font = { bold: true };

        worksheet.mergeCells(`K${[rowCount + 3]}:L${[rowCount + 3]}`);
        const requestedByValue = worksheet.getCell(`K${rowCount + 3}`);
        requestedByValue.value = newData.data.requestedBy;
        requestedByValue.border = { bottom: { style: "medium" } };

        //Reviewed By
        const reviewedBy = worksheet.getCell(`J${[rowCount + 4]}`);
        reviewedBy.value = "Reviewed By";
        reviewedBy.font = { bold: true };

        worksheet.mergeCells(`K${[rowCount + 4]}:L${[rowCount + 4]}`);
        const reviewedByValue = worksheet.getCell(`K${rowCount + 4}`);
        reviewedByValue.value = "Esther Alfred";
        reviewedByValue.border = { bottom: { style: "medium" } };

        //Approved By
        const approvedBy = worksheet.getCell(`J${[rowCount + 5]}`);
        approvedBy.value = "Approved By";
        approvedBy.font = { bold: true };

        worksheet.mergeCells(`K${[rowCount + 5]}:L${[rowCount + 5]}`);
        const approvedByValue = worksheet.getCell(`K${rowCount + 5}`);
        approvedByValue.value = newData.data.approvedBy;
        approvedByValue.border = { bottom: { style: "medium" } };

        // Comment
        worksheet.mergeCells(`B${[rowCount + 6]}:C${[rowCount + 6]}`);
        const comment = worksheet.getCell(`B${[rowCount + 6]}`);
        comment.value = "COMMENTS:";
        comment.font = { bold: true };
        comment.border = {
          top: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
        };

        worksheet.mergeCells(`D${[rowCount + 6]}:I${[rowCount + 9]}`);
        const commentsValue = worksheet.getCell(`D${[rowCount + 6]}`);
        commentsValue.border = {
          top: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
        };
        commentsValue.alignment = {
          vertical: "top",
          horizontal: "left",
        };

        ////////////////////////////////////////
        //DOWNLOAD FILE
        ////////////////////////////////////////

        const buffer = await workbook.xlsx.writeBuffer();
        const fileType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const excelExtension = ".xlsx";
        const blob = new Blob([buffer], { type: fileType });

        if ((window.navigator as any).msSaveBlob) {
          (window.navigator as any).msSaveBlob(
            blob,
            `Purchase_Request_${new Date()}` + excelExtension
          );
        } else {
          const link = document.createElement("a");
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute(
            "download",
            `Purchase_Request_${new Date()}` + excelExtension
          );
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          // put alert showing file downloaded succesfully
          // handle loading state
        }
      }
    } catch (error) {
      console.log(error);
    }

    //////////////////////////
    //RESET FORM STATE
    /////////////////////////
    reset();
    setItemGroups([]);
    alert("File downloaded successfully");
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
            id="requiredBy"
            required
            {...register("requiredBy")}
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
          type="wide"
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
      {/* Dynamic itemGroup */}

      <ItemContainer>
        {itemGroup.map((group, index) => (
          <StyledPurchaseItem key={index}>
            <h4>ITEM {index + 1}</h4>

            <Row>
              <FormRow label="Description *" type="wide">
                <Input
                  placeholder=""
                  size="wide"
                  disabled={group.disabled}
                  value={group.description}
                  required
                  title="This field is required"
                  onChange={(e: any) =>
                    handleChange(index, "description", e.target.value)
                  }
                />
              </FormRow>
            </Row>

            <Row>
              <FormRow label="Frequency *" type="small">
                <Input
                  placeholder=""
                  type="number"
                  min="0"
                  disabled={group.disabled}
                  required
                  value={group.frequency}
                  onChange={(e: any) => {
                    handleChange(index, "frequency", e.target.value);
                  }}
                />
              </FormRow>
              <FormRow label="Quantity *" type="small">
                <Input
                  placeholder=""
                  type="number"
                  min="0"
                  disabled={group.disabled}
                  value={group.quantity}
                  onChange={(e: any) => {
                    handleChange(index, "quantity", e.target.value);
                  }}
                />
              </FormRow>
              <FormRow label="Unit" type="small">
                <Input
                  disabled={group.disabled}
                  value={group.unit}
                  placeholder=""
                  onChange={(e: any) => {
                    handleChange(index, "unit", e.target.value);
                  }}
                />
              </FormRow>
            </Row>
            <Row>
              <FormRow label="Unit Cost (₦) *" type="medium">
                <Input
                  type="number"
                  min="0"
                  disabled={group.disabled}
                  value={group.unitCost}
                  placeholder="123..."
                  onChange={(e: any) => {
                    handleChange(index, "unitCost", e.target.value);
                  }}
                />
              </FormRow>

              <FormRow label="Total (₦)*" type="medium">
                <Input
                  placeholder=""
                  type="number"
                  disabled={group.disabled}
                  value={group.total}
                  onChange={(e: any) =>
                    handleChange(index, "total", e.target.value)
                  }
                />
              </FormRow>
            </Row>
            <div>
              <ItemDeleteButton
                type="button"
                onClick={() => removeGroup(index)}
              >
                Delete Item {index + 1}
              </ItemDeleteButton>
              <ItemDoneButton
                // isDisabled={group.disabled}
                type="button"
                onClick={() => handledEdit(index)}
              >
                {group.disabled ? "Edit Item" : "Done"}
              </ItemDoneButton>
            </div>
          </StyledPurchaseItem>
        ))}
      </ItemContainer>

      {/* //////////////////////////////////////////////////////// */}
      {/* //////////////////////////////////////////////////////// */}
      {/* //////////////////////////////////////////////////////// */}

      {/* <button onClick={() => console.log(itemGroup)}>Commit Item</button> */}

      <Button type="counter" onClick={additems}>
        Add Item
        <FaPlus />
      </Button>
      <span>
        {itemGroup.length > 1
          ? itemGroup.length + " Items "
          : itemGroup.length + " item "}
        Added
      </span>

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

        <FormRow label="Account Code *" type="small">
          <Input
            type="text"
            min="0"
            max="100"
            step=".1"
            required
            placeholder=""
            id="accountCode"
            {...register("accountCode", { min: 0, max: 100 })}
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
