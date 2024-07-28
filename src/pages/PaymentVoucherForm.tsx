import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ExcelJS from "exceljs";
import { compareAsc, format } from "date-fns";

import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import Input from "../ui/Input";
import Row from "../ui/Row";
import Button from "../ui/Button";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "../ui/Select";
import Textarea from "../ui/TextArea";
import { data } from "../dropDownData";
import { FormValues } from "../interfaces";

function PaymentVoucherForm() {
  const [menuOption, setMenuOption] = useState("");
  const [chartCode, setChartCode] = useState("");
  const [grossAmount, setGrossAmount] = useState<number>();
  const [vat, setVat] = useState<number>();
  const [wht, setWht] = useState<number>();
  const [deductions, setDeductions] = useState<number>();
  const [netAmount, setNetAmount] = useState<number>();
  const [devLevy, setDevLevy] = useState<number>();

  const [date, setDate] = useState<Date>(new Date());
  const { register, handleSubmit, formState } = useForm<Partial<FormValues>>();
  const { errors } = formState;

  /////////////////////////////////////////
  //UPDATE ON MOUNT
  /////////////////////////////////////////
  useEffect(function () {
    setGrossAmount(0);
    setVat(0);
    setWht(0);
    setDeductions(0);
    setNetAmount(0);
    setDevLevy(0);
  }, []);

  /////////////////////////////////////////
  //HANDLERS
  /////////////////////////////////////////
  function handleGrossAmount(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setGrossAmount(Number(e.target.value));
  }

  function handleVat(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    setVat(Number(e.target.value));
  }

  function handleWht(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    setWht(Number(e.target.value));
  }

  function handleDevLevy(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    setDevLevy(Number(e.target.value));
  }

  function handleOtherDeductions(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    setDeductions(Number(e.target.value));
  }

  function handleChartOfAcc(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    const selected = e.target.value;
    setMenuOption(selected);

    const codeObject = data.find((d) => d.position.trim() == selected.trim());
    setChartCode(codeObject!.code);
  }

  /////////////////////////////////////////
  //EVENTS UPDATE
  /////////////////////////////////////////
  useEffect(
    function () {
      if (grossAmount! > 0) {
        const netPercent =
          (Number(grossAmount!) / 100) * Number(vat! + wht! + devLevy!);
        const vatSum = grossAmount! - netPercent;

        deductions ? setNetAmount(vatSum - deductions) : setNetAmount(vatSum);
      }
    },
    [grossAmount, vat, wht, devLevy, deductions]
  );

  /////////////////////////////////////////////

  async function formSubmit(data: Partial<FormValues>) {
    console.log(data);

    try {
      if (data) {
        const workbook = new ExcelJS.Workbook();
        ////////////////////////////////////////
        //EXCELSHEET METADATA
        ////////////////////////////////////////
        workbook.creator = data.preparedBy!;
        workbook.lastModifiedBy = "Her";
        workbook.created = new Date();
        const worksheet = workbook.addWorksheet("Payment Voucher");

        //////////////////////////////////////////
        //HEADER
        //////////////////////////////////////////
        worksheet.mergeCells("K1:L7"); //#valueCell
        worksheet.mergeCells("A8:V8"); //#titleCell
        worksheet.mergeCells("A9:V9"); //#payVouherCell
        //////////////////////////////////////////
        //BODY
        //////////////////////////////////////////
        worksheet.mergeCells("A13:C13"); //# nameOFOrgCell
        worksheet.mergeCells("D13:I13"); //# nameOFOrgValue
        // worksheet.mergeCells("O13:P13"); //# pvNoCell
        worksheet.mergeCells("T13:U13"); //# pvNoValue
        worksheet.mergeCells("A15:C15"); //# orgCodeCell
        worksheet.mergeCells("D15:G15"); //# orgCodeCellValue
        worksheet.mergeCells("K15:L15"); //# payingStationCell
        worksheet.mergeCells("M15:O15"); //# payingStationCellValue
        worksheet.mergeCells("R15:S15"); //# monthYearCell
        worksheet.mergeCells("T15:U15"); //# monthYearValue
        worksheet.mergeCells("A17:C17"); //# deptCodeCell
        worksheet.mergeCells("D17:G17"); //# deptCodeValue
        worksheet.mergeCells("B19:R19"); //# payCellValue
        worksheet.mergeCells("B21:R21"); //# beingValue
        worksheet.mergeCells("A22:R22"); //# beingValue
        worksheet.mergeCells("A24:C24"); //# amountInWordsCell
        worksheet.mergeCells("D24:R24"); //# amountInWordsValue
        worksheet.mergeCells("A25:R25"); //# amountInWordsValue
        //////////////////////////////////////////
        //TABLE CELLS
        //////////////////////////////////////////
        //TABLE HEADER CELLS
        worksheet.mergeCells("A28:C28"); //# debitPostingCell
        worksheet.mergeCells("A29:C29"); //# accsDescriptionCell
        worksheet.mergeCells("D29:G29"); //# grantCodeCell
        worksheet.mergeCells("H29:J29"); //# grossAmountCell
        worksheet.mergeCells("K29:L29"); //# vatCell
        worksheet.mergeCells("M29:N29"); //# whtCell
        worksheet.mergeCells("O29:P29"); //# devLevyCell
        worksheet.mergeCells("Q29:S29"); //# otherDeductionsCell
        worksheet.mergeCells("T29:V29"); //# netAmountCell

        //TABLE ROWS CELLS
        worksheet.mergeCells("A30:C30"); //# accsDescriptionValue
        worksheet.mergeCells("D30:G30"); //# grantCodeValue
        worksheet.mergeCells("H30:J30"); //# grossAmountValue
        worksheet.mergeCells("K30:L30"); //# vatValue
        worksheet.mergeCells("M30:N30"); //# whtValue
        worksheet.mergeCells("O30:P30"); //# devLevyValue
        worksheet.mergeCells("Q30:S30"); //# otherDeductionsValue
        worksheet.mergeCells("T30:V30"); //# netAmountValue

        // Optionally, set some value or style to the merged cell
        const valueCell = worksheet.getCell("K1");
        valueCell.value = "#value";
        valueCell.alignment = { vertical: "bottom", horizontal: "center" };
        valueCell.font = { bold: false, size: 14 };

        const titleCell = worksheet.getCell("A8");
        titleCell.value = "UNIQUE CARE AND SUPPORT FOUNDATION (CASFOD)";
        titleCell.alignment = { vertical: "middle", horizontal: "center" };
        titleCell.font = { bold: true, size: 20 };

        const payVoucherCell = worksheet.getCell("A9");
        payVoucherCell.value = "PAYMENT VOUCHER";
        payVoucherCell.alignment = { vertical: "middle", horizontal: "center" };
        payVoucherCell.font = { bold: true, size: 16 };

        const nameOFOrgCell = worksheet.getCell("A13");
        nameOFOrgCell.value = "Name of Organization:";
        nameOFOrgCell.font = { bold: true, size: 14 };
        const nameOFOrgValue = worksheet.getCell("D13");
        nameOFOrgValue.value = "UNIQUE CARE AND SUPPORT FOUNDATION";

        const pvNoCell = worksheet.getCell("S13");
        pvNoCell.value = "PV No:";
        pvNoCell.alignment = { vertical: "middle", horizontal: "right" };
        pvNoCell.font = { bold: true, size: 14 };
        const pvNoValue = worksheet.getCell("U13");
        pvNoValue.value = data.pvNumber;

        const orgCodeCell = worksheet.getCell("A15");
        orgCodeCell.value = "Organization Code:";
        orgCodeCell.font = { bold: true, size: 14 };
        const orgCodeCellValue = worksheet.getCell("D15");
        orgCodeCellValue.value = "CAC/IT/NO 123565";

        const payingStation = worksheet.getCell("K15");
        payingStation.value = "Paying station:";
        payingStation.font = { bold: true, size: 14 };
        const payingStationValue = worksheet.getCell("M15");
        payingStationValue.value = data.payingStation;

        const monthYearCell = worksheet.getCell("R15");
        monthYearCell.value = "Month/Year:";
        monthYearCell.alignment = { vertical: "middle", horizontal: "right" };
        monthYearCell.font = { bold: true, size: 14 };
        const monthYearValue = worksheet.getCell("T15");
        monthYearValue.value = format(Date.now(), "yyyy-MM-dd");

        const deptCodeCell = worksheet.getCell("A17");
        deptCodeCell.value = "Departmental Code:";
        deptCodeCell.font = { bold: true, size: 14 };
        const deptCodeCellValue = worksheet.getCell("D17");
        deptCodeCellValue.value = data.departmentalCode;

        const payCell = worksheet.getCell("A19");
        payCell.value = "PAY:";
        payCell.font = { bold: true, size: 14 };
        const payValue = worksheet.getCell("B19");
        payValue.value = data.payTo;

        const beingCell = worksheet.getCell("A21");
        beingCell.value = "BEING:";
        beingCell.font = { bold: true, size: 14 };
        const beingValue = worksheet.getCell("B21");
        beingValue.value = data.being;

        const amountInWordsCell = worksheet.getCell("A24");
        amountInWordsCell.value = "Amount In Words:";
        amountInWordsCell.font = { bold: true, size: 14 };
        const amountInWordsValue = worksheet.getCell("D24");
        amountInWordsValue.value = data.amountInWords;

        ///////////////////////////////////////////////////
        //TABLE DATA
        //////////////////////////////////////////////////
        const debitPostingCell = worksheet.getCell("A28");
        debitPostingCell.value = "Debit Posting";
        debitPostingCell.font = { bold: true, size: 14 };

        //////////////////////////////////////////////////
        const accsDescriptionCell = worksheet.getCell("A29");
        accsDescriptionCell.value = "Accounts Description";
        accsDescriptionCell.alignment = {
          vertical: "bottom",
          horizontal: "center",
        };
        accsDescriptionCell.font = { bold: true, size: 16 };

        //////////////////////////////////////////////////
        const grantCodeCell = worksheet.getCell("D29");
        grantCodeCell.value = "Grant Code";
        grantCodeCell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        grantCodeCell.font = { bold: true, size: 14 };
        const grantCodeValue = worksheet.getCell("D30");
        grantCodeValue.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        grantCodeValue.value = data.grantCode;

        //////////////////////////////////////////////////
        const grossAmountCell = worksheet.getCell("H29");
        grossAmountCell.value = "Gross Amount =N=";
        grossAmountCell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        grossAmountCell.font = { bold: true, size: 14 };

        const grossAmountValue = worksheet.getCell("H30");
        grossAmountValue.value = data.grossAmount;

        //////////////////////////////////////////////////
        const vatCell = worksheet.getCell("K29");
        vatCell.value = `VAT: ${data.vat || "0"}%`;
        vatCell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        vatCell.font = { bold: true, size: 14 };

        const vatValue = worksheet.getCell("K30");
        vatValue.value = (Number(data.grossAmount) / 100) * Number(data.vat);

        //////////////////////////////////////////////////
        const whtCell = worksheet.getCell("M29");
        whtCell.value = `WHT: ${data.wht || "0"}%`;
        whtCell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        whtCell.font = { bold: true, size: 14 };
        const whtValue = worksheet.getCell("M30");
        whtValue.value = (Number(data.grossAmount) / 100) * Number(data.wht);

        //////////////////////////////////////////////////
        const devLevyCell = worksheet.getCell("O29");
        devLevyCell.value = `Dev.levy: ${data.devLevy || "0"}%`;
        devLevyCell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        devLevyCell.font = { bold: true, size: 14 };
        const devLevyValue = worksheet.getCell("O30");
        devLevyValue.value =
          (Number(data.grossAmount) / 100) * Number(data.devLevy);

        //////////////////////////////////////////////////
        const otherDeductionsCell = worksheet.getCell("Q29");
        otherDeductionsCell.value = `Other Deductions`;
        otherDeductionsCell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        otherDeductionsCell.font = { bold: true, size: 14 };
        const otherDeductionsValue = worksheet.getCell("Q30");
        otherDeductionsValue.value = data.otherDeductions;

        //////////////////////////////////////////////////
        const netAmountCell = worksheet.getCell("T29");
        netAmountCell.value = `Net Amount =N=`;
        netAmountCell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        netAmountCell.font = { bold: true, size: 14 };
        const netAmountValue = worksheet.getCell("T30");
        netAmountValue.value = data.otherDeductions;
        ////////////////////////////////////////
        //ROWS AND COLUMN
        ////////////////////////////////////////

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
            `Payment_Voucher_${new Date()}` + excelExtension
          );
        } else {
          const link = document.createElement("a");
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute(
            "download",
            `Payment_Voucher_${new Date()}` + excelExtension
          );
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          console.log("clicked");
          document.body.removeChild(link);
          // put alert showing file downloaded succesfully
          // handle loading state
        }
      }
    } catch (err) {
      console.log(err);
    }

    ///////////////////////////////////
    //REMEMBER RESET STATE
    ///////////////////////////////////

    // setGrossAmount(0);
    // setVat(0);
    // setWht(0);
    // setDeductions(0);
    // setNetAmount(0);
    // setDevLevy(0);
  }

  return (
    <Form onSubmit={handleSubmit(formSubmit)}>
      <Row>
        <FormRow
          label="Departmental Code *"
          error={errors?.departmentalCode?.message}
        >
          <Input
            placeholder="code"
            id="departmentalCode"
            {...register("departmentalCode", {
              required: "This field is required",
            })}
          />
        </FormRow>

        <FormRow
          label="PV Number *"
          type="small"
          error={errors?.pvNumber?.message}
        >
          <Input
            placeholder=""
            id="pvNumber"
            {...register("pvNumber", {
              required: "This field is required",
            })}
          />
        </FormRow>
      </Row>

      <Row>
        <FormRow
          label="Paying Station *"
          error={errors?.payingStation?.message}
        >
          <Input
            placeholder=""
            id="payingStation"
            {...register("payingStation", {
              required: "This field is required",
            })}
          />
        </FormRow>

        <FormRow label="Month/Year" type="small">
          <DatePicker
            id="date"
            // onChange={(date) => setDate(date)}
            selected={date}
            dateFormat="dd/MM/yyyy"
            // {...register("date")}
          />
        </FormRow>
      </Row>

      <Row>
        <FormRow label="Pay To *" type="large" error={errors?.payTo?.message}>
          <Input
            placeholder=""
            id="payTo"
            {...register("payTo", {
              required: "This field is required",
              minLength: {
                value: 2,
                message: "Minimum number of characters is 2",
              },
              maxLength: 100,
            })}
          />
        </FormRow>
      </Row>

      <Row>
        <FormRow label="Being *" type="large" error={errors?.being?.message}>
          <Textarea
            placeholder=""
            id="being"
            {...register("being", {
              required: "This field is required",
            })}
          />
        </FormRow>
      </Row>

      <Row>
        <FormRow
          label="Amount in Words *"
          type="large"
          error={errors?.amountInWords?.message}
        >
          <Textarea
            placeholder=""
            id="amountInWords"
            {...register("amountInWords", {
              required: "This field is required",
            })}
          />
        </FormRow>
      </Row>

      <Row>
        <FormRow
          label="Grant Code *"
          type="medium"
          error={errors?.grantCode?.message}
        >
          <Input
            placeholder=""
            id="grantCode"
            {...register("grantCode", {
              required: "This field is required",
            })}
          />
        </FormRow>

        <FormRow
          label="Gross Amount (₦) *"
          type="medium"
          error={errors?.grossAmount?.message}
        >
          <Input
            type="number"
            min="0"
            value={grossAmount || ""}
            placeholder="123..."
            id="grossAmount"
            {...register("grossAmount", {
              required: "This field is required",
            })}
            onChange={handleGrossAmount}
          />
        </FormRow>
      </Row>

      <Row>
        <FormRow label="VAT (%)" type="small">
          <Input
            type="number"
            min="0"
            max="100"
            value={vat || ""}
            placeholder=""
            id="vat"
            {...register("vat", { min: 0, max: 100 })}
            onChange={handleVat}
          />
        </FormRow>
        <FormRow label="WHT (%)" type="small">
          <Input
            type="number"
            min="0"
            max="100"
            value={wht || ""}
            placeholder=""
            id="wht"
            {...register("wht", { min: 0, max: 100 })}
            onChange={handleWht}
          />
        </FormRow>
        <FormRow label="Development Levy (%)" type="small">
          <Input
            type="number"
            min="0"
            max="100"
            value={devLevy || ""}
            placeholder=""
            id="devLevy"
            {...register("devLevy", { min: 0, max: 100 })}
            onChange={handleDevLevy}
          />
        </FormRow>
      </Row>

      <Row>
        <FormRow label="Other Deductions (₦)" type="medium">
          <Input
            type="number"
            min="0"
            placeholder=""
            value={deductions || ""}
            id="otherDeductions"
            {...register("otherDeductions")}
            onChange={handleOtherDeductions}
          />
        </FormRow>
      </Row>

      <Row>
        {/* //////////NET AMOUNT//////////// */}
        <FormRow
          label="Net Amount (₦) *"
          type="medium"
          error={errors?.netAmount?.message}
        >
          <Input
            value={netAmount}
            placeholder=""
            id="netAmount"
            readOnly
            {...register("netAmount")}
          />
        </FormRow>
      </Row>

      <Row>
        <FormRow
          label="Chart of Account *"
          type="medium"
          error={errors?.chartOfAccount?.message}
        >
          <Select
            id="chartOfAccount"
            type="gray"
            options={data}
            value={menuOption}
            onChange={handleChartOfAcc}
          />
        </FormRow>
        <FormRow
          label="Chart of Acc. Code *"
          type="medium"
          error={errors?.chartOfAccountCode?.message}
        >
          <Input
            value={chartCode}
            placeholder=""
            id="chartOfAccountCode"
            readOnly
            {...register("chartOfAccountCode")}
          />
        </FormRow>
      </Row>

      <Row>
        <FormRow label="Proj. Budget Line" type="medium">
          <Input
            placeholder=""
            id="projBudgetLine"
            {...register("projBudgetLine")}
          />
        </FormRow>

        <FormRow label="Note" type="medium">
          <Input placeholder="" id="note" {...register("note")} />
        </FormRow>
      </Row>

      <Row>
        <FormRow label="Mandate Reference" type="medium">
          <Input
            placeholder=""
            id="mandateReference"
            {...register("mandateReference")}
          />
        </FormRow>
      </Row>

      <Row>
        <FormRow
          label="Prepared By *"
          type="medium"
          error={errors?.preparedBy?.message}
        >
          <Input
            placeholder=""
            id="preparedBy"
            {...register("preparedBy", {
              required: "This field is required",
              minLength: 2,
              maxLength: 100,
            })}
            maxLength={100}
          />
        </FormRow>
        <FormRow
          label="Checked By *"
          type="medium"
          error={errors?.checkedBy?.message}
        >
          <Input
            placeholder=""
            id="checkedBy"
            {...register("checkedBy", {
              required: "This field is required",
              minLength: 2,
              maxLength: 100,
            })}
            maxLength={100}
          />
        </FormRow>
      </Row>

      <Button size="medium">Download</Button>
    </Form>
  );
}

export default PaymentVoucherForm;
