import ExcelJS from "exceljs";

import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import Input from "../ui/Input";
import Row from "../ui/Row";
import Button from "../ui/Button";
import { useEffect, useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import Select from "../ui/Select";
import Textarea from "../ui/TextArea";
import { data, categories } from "../dropDownData";
import { Filter, FormValues } from "../interfaces";
import { base64String } from "../services/logo64";

function PaymentVoucherForm() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [menuOption, setMenuOption] = useState("");
  const [chartCode, setChartCode] = useState("");
  const [catOption, setCatOption] = useState("");
  const [catCode, setCatCode] = useState("");
  const [dataFilter, setDataFilter] = useState<Filter[]>();
  const [grossAmount, setGrossAmount] = useState<number>();
  const [vat, setVat] = useState<number>();
  const [wht, setWht] = useState<number>();
  const [deductions, setDeductions] = useState<number>();
  const [netAmount, setNetAmount] = useState<number>();
  const [devLevy, setDevLevy] = useState<number>();
  const [date, setDate] = useState<string>();
  const [pvNumber, setPvNumber] = useState<string>();
  const [grantCode, setGrantCode] = useState<string>();

  const { register, handleSubmit, formState, reset } =
    useForm<Partial<FormValues>>();
  const { errors } = formState;

  const dState = { position: "--", code: "--" };

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
  function handleGrossAmount(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setGrossAmount(Number(e.target.value));
  }

  /////////////////////////////////////////////////////////

  function handleDate(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setDate(e.target.value);
  }

  /////////////////////////////////////////////////////////

  function handleGrantCode(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setGrantCode(e.target.value);
  }

  /////////////////////////////////////////////////////////

  function handleVat(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    setVat(Number(e.target.value));
  }

  /////////////////////////////////////////////////////////

  function handleWht(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    setWht(Number(e.target.value));
  }

  /////////////////////////////////////////////////////////

  function handleDevLevy(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    setDevLevy(Number(e.target.value));
  }

  /////////////////////////////////////////////////////////

  function handleOtherDeductions(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    setDeductions(Number(e.target.value));
  }

  ////////////////////////////////////////////////////////////////

  function handleChartOfAccCat(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    const selected = e.target.value;
    setCatOption(selected);

    const catObject = categories.find(
      (c) => c.position.trim() === selected.trim()
    );
    setCatCode(catObject!.code);
    setChartCode(dState.code);
  }

  ////////////////////////////////////////////////////////////////

  function handleChartOfAcc(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    const selected = e.target.value;
    setMenuOption(selected);

    const codeObject = data.find((d) => d.position.trim() === selected.trim());
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

  useEffect(
    function () {
      let catData = data.filter((d) => d.code.split(".")[0] === catCode);

      catData.unshift(dState);
      setDataFilter(catData);
    },
    [catOption, catCode]
  );

  useEffect(
    function () {
      if (grantCode && date) {
        const dateArray = date.split("-");
        setPvNumber(`CASFOD/${grantCode}/${dateArray[1]}/${dateArray[0]}-001`);
      }
    },
    [grantCode, date]
  );

  ///////////////////////////////////////////////
  //FORM SUBMIT FUNCTION
  ///////////////////////////////////////////////
  async function formSubmit(data: Partial<FormValues>) {
    data.chartOfAccount = menuOption;
    data.chartOfAccountCode = chartCode;
    data.chartOfAccountCategories = catCode;
    data.pvNumber = pvNumber;

    data.netAmount = netAmount?.toString();
    console.log(data);

    setIsDownloading(true);
    try {
      if (data) {
        const workbook = new ExcelJS.Workbook();
        ////////////////////////////////////////
        //EXCELSHEET METADATA
        ////////////////////////////////////////
        workbook.creator = data.preparedBy!;
        workbook.lastModifiedBy = "Her";
        workbook.created = new Date();

        //ADD LOGO STEP 2
        const imageId1 = workbook.addImage({
          base64: base64String,
          extension: "png",
        });

        const worksheet = workbook.addWorksheet("Payment Voucher");

        //////////////////////////////////////////
        //HEADER
        //////////////////////////////////////////
        worksheet.mergeCells("J1:M7"); //#valueCell
        worksheet.mergeCells("A8:V8"); //#titleCell
        worksheet.mergeCells("A9:V9"); //#payVouherCell
        //////////////////////////////////////////
        //BODY
        //////////////////////////////////////////
        worksheet.mergeCells("A13:C13"); //# nameOFOrgCell
        worksheet.mergeCells("D13:I13"); //# nameOFOrgValue
        //'A49'; # pvNoCell
        worksheet.mergeCells("T13:V13"); //# pvNoValue
        worksheet.mergeCells("A15:C15"); //# orgCodeCell
        worksheet.mergeCells("D15:G15"); //# orgCodeCellValue
        worksheet.mergeCells("K15:L15"); //# payingStationCell
        worksheet.mergeCells("M15:P15"); //# payingStationCellValue
        worksheet.mergeCells("R15:S15"); //# monthYearCell
        worksheet.mergeCells("T15:V15"); //# monthYearValue
        worksheet.mergeCells("A17:C17"); //# deptCodeCell
        worksheet.mergeCells("D17:G17"); //# deptCodeValue
        //'A19'; # payCell
        worksheet.mergeCells("B19:R19"); //# payCellValue
        //'A21'; # beingCell
        worksheet.mergeCells("B21:V21"); //# beingValue
        worksheet.mergeCells("A22:V22"); //# beingValue
        worksheet.mergeCells("A24:C24"); //# amountInWordsCell
        worksheet.mergeCells("D24:V24"); //# amountInWordsValue
        worksheet.mergeCells("A25:V25"); //# amountInWordsValue
        //////////////////////////////////////////
        //TABLE CELLS
        //////////////////////////////////////////
        //TABLE1 HEADER CELLS
        worksheet.mergeCells("A28:C28"); //# debitPostingCell

        worksheet.mergeCells("A29:C29"); //# accsDescriptionCell
        worksheet.mergeCells("D29:G29"); //# grantCodeCell
        worksheet.mergeCells("H29:J29"); //# grossAmountCell
        worksheet.mergeCells("K29:L29"); //# vatCell
        worksheet.mergeCells("M29:N29"); //# whtCell
        worksheet.mergeCells("O29:P29"); //# devLevyCell
        worksheet.mergeCells("Q29:S29"); //# otherDeductionsCell
        worksheet.mergeCells("T29:V29"); //# netAmountCell

        //TABLE1 ROWS CELLS
        worksheet.mergeCells("A30:C30"); //# accsDescriptionValue
        worksheet.mergeCells("D30:G30"); //# grantCodeValue
        worksheet.mergeCells("H30:J30"); //# grossAmountValue
        worksheet.mergeCells("K30:L30"); //# vatValue
        worksheet.mergeCells("M30:N30"); //# whtValue
        worksheet.mergeCells("O30:P30"); //# devLevyValue
        worksheet.mergeCells("Q30:S30"); //# otherDeductionsValue
        worksheet.mergeCells("T30:V30"); //# netAmountValue

        ////////////////////////////////////////////////////////////////

        //TABLE2 HEADER CELLS
        worksheet.mergeCells("A32:C32"); //# accountPostingCell

        worksheet.mergeCells("A33:D33"); //# cashAndLedgerCell
        worksheet.mergeCells("E33:H33"); //# chartOfAccountCell
        worksheet.mergeCells("I33:L33"); //# chartOfAccountCodeCell
        worksheet.mergeCells("M33:O33"); //# proj.BudgetLineCell
        worksheet.mergeCells("P33:S33"); //# noteCell
        worksheet.mergeCells("T33:V33"); //# mandateReferenceCell

        //TABLE2 ROWS CELLS
        worksheet.mergeCells("A34:D34"); //# cashAndLedgerValue
        worksheet.mergeCells("E34:H34"); //# chartOfAccountValue
        worksheet.mergeCells("I34:L34"); //# chartOfAccountCodeValue
        worksheet.mergeCells("M34:O34"); //# proj.BudgetLineValue
        worksheet.mergeCells("P34:S34"); //# noteCell
        worksheet.mergeCells("T34:V34"); //# mandateReferenceValue

        /////////////////////////////////////////////////////
        //FOOTER CELLS
        /////////////////////////////////////////////////////
        worksheet.mergeCells("J37:M37"); //# certifyCell
        worksheet.mergeCells("A38:K38"); //# footerDescCell

        worksheet.mergeCells("A41:F41"); //# opVoucherCell
        worksheet.mergeCells("G41:I41"); //# opNameCell
        worksheet.mergeCells("J41:M41"); //# opNameValue
        worksheet.mergeCells("O41:P41"); //# opSignatureCell
        worksheet.mergeCells("Q41:S41"); //# opSignatureValue
        worksheet.mergeCells("U41:V41"); //# opDateValue

        worksheet.mergeCells("A43:F43"); //# ocVoucherCell
        worksheet.mergeCells("G43:I43"); //# ocNameCell
        worksheet.mergeCells("J43:M43"); //# ocNameValue
        worksheet.mergeCells("O43:P43"); //# ocSignatureCell
        worksheet.mergeCells("Q43:S43"); //# ocSignatureValue
        worksheet.mergeCells("U43:V43"); //# ocDateValue

        worksheet.mergeCells("A45:C45"); //# clarificationCelll
        worksheet.mergeCells("A46:V46"); //# clarificationValue

        //'A49'; # clNameCell
        worksheet.mergeCells("B49:F49"); //# clNameValue
        //'H49'; # clTitleCell
        worksheet.mergeCells("I49:L49"); //# clTitleValue

        worksheet.mergeCells("N49:O49"); //# clSignatureCell
        worksheet.mergeCells("P49:R49"); //# clSignatureValue
        //'T49'; # clDateCell
        worksheet.mergeCells("U49:V49"); //# clDateValue

        //ADD LOGO STEP 3
        worksheet.addImage(imageId1, {
          tl: { col: 9, row: 1 },
          ext: { width: 250, height: 100 },
        });

        // worksheet.addImage(imageId1, {
        //   tl: { col: 10, row: 1 } as Anchor,
        //   br: { col: 11, row: 6 } as Anchor,
        // });

        ////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////
        const titleCell = worksheet.getCell("A8");
        titleCell.value = "UNIQUE CARE AND SUPPORT FOUNDATION (CASFOD)";
        titleCell.alignment = { vertical: "middle", horizontal: "center" };
        titleCell.font = { bold: true, size: 20 };

        ////////////////////////////////////////////////////////
        const payVoucherCell = worksheet.getCell("A9");
        payVoucherCell.value = "PAYMENT VOUCHER";
        payVoucherCell.alignment = { vertical: "middle", horizontal: "center" };
        payVoucherCell.font = { bold: true, size: 16 };

        ////////////////////////////////////////////////////////
        const nameOFOrgCell = worksheet.getCell("A13");
        nameOFOrgCell.value = "Name of Organization:";
        nameOFOrgCell.font = { bold: true, size: 14 };
        const nameOFOrgValue = worksheet.getCell("D13");
        nameOFOrgValue.value = "UNIQUE CARE AND SUPPORT FOUNDATION";

        ////////////////////////////////////////////////////////
        const pvNoCell = worksheet.getCell("S13");
        pvNoCell.value = "PV No:";
        pvNoCell.alignment = { vertical: "middle", horizontal: "right" };
        pvNoCell.font = { bold: true, size: 14 };

        const pvNoValue = worksheet.getCell("T13");
        pvNoValue.value = data.pvNumber;
        pvNoValue.border = { bottom: { style: "medium" } };

        ////////////////////////////////////////////////////////
        const orgCodeCell = worksheet.getCell("A15");
        orgCodeCell.value = "Organization Code:";
        orgCodeCell.font = { bold: true, size: 14 };
        const orgCodeCellValue = worksheet.getCell("D15");
        orgCodeCellValue.value = "CAC/IT/NO 123565";

        ////////////////////////////////////////////////////////
        const payingStation = worksheet.getCell("K15");
        payingStation.value = "Paying station:";
        payingStation.font = { bold: true, size: 14 };
        const payingStationValue = worksheet.getCell("M15");
        payingStationValue.value = data.payingStation;
        payingStationValue.border = { bottom: { style: "medium" } };

        ////////////////////////////////////////////////////////
        const monthYearCell = worksheet.getCell("R15");
        monthYearCell.value = "Month/Year:";
        monthYearCell.alignment = { vertical: "middle", horizontal: "right" };
        monthYearCell.font = { bold: true, size: 14 };
        const monthYearValue = worksheet.getCell("T15");
        monthYearValue.value = data.date;
        monthYearValue.border = { bottom: { style: "medium" } };

        ////////////////////////////////////////////////////////
        const deptCodeCell = worksheet.getCell("A17");
        deptCodeCell.value = "Departmental Code:";
        deptCodeCell.font = { bold: true, size: 14 };
        const deptCodeValue = worksheet.getCell("D17");
        deptCodeValue.value = data.departmentalCode;
        deptCodeValue.border = { bottom: { style: "medium" } };

        ////////////////////////////////////////////////////////
        const payCell = worksheet.getCell("A19");
        payCell.value = "PAY:";
        payCell.font = { bold: true, size: 14 };
        const payValue = worksheet.getCell("B19");
        payValue.value = data.payTo;
        payValue.border = { bottom: { style: "medium" } };

        ////////////////////////////////////////////////////////
        const beingCell = worksheet.getCell("A21");
        beingCell.value = "BEING:";
        beingCell.font = { bold: true, size: 14 };
        const beingValue1 = worksheet.getCell("B21");
        const beingValue2 = worksheet.getCell("A22");
        beingValue1.value = data.being;
        beingValue1.border = { bottom: { style: "medium" } };
        beingValue2.border = { bottom: { style: "medium" } };

        ////////////////////////////////////////////////////////
        const amountInWordsCell = worksheet.getCell("A24");
        amountInWordsCell.value = "Amount In Words:";
        amountInWordsCell.font = { bold: true, size: 14 };
        const amountInWordsValue1 = worksheet.getCell("D24");
        const amountInWordsValue2 = worksheet.getCell("A25");
        amountInWordsValue1.value = data.amountInWords;
        amountInWordsValue1.border = { bottom: { style: "medium" } };
        amountInWordsValue2.border = { bottom: { style: "medium" } };

        ///////////////////////////////////////////////////
        //TABLE1 DATA
        //////////////////////////////////////////////////
        const debitPostingCell = worksheet.getCell("A28");
        debitPostingCell.value = "Debit Posting";
        debitPostingCell.font = { bold: true, size: 16 };

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
        grossAmountValue.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
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
        vatValue.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
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
        whtValue.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
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
        devLevyValue.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
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
        otherDeductionsValue.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
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
        netAmountValue.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        netAmountValue.value = Number(data.netAmount).toFixed(2);

        ///////////////////////////////////////////////////
        //TABLE2 DATA
        //////////////////////////////////////////////////
        const accountPostingCell = worksheet.getCell("A32");
        accountPostingCell.value = "Account Posting";
        accountPostingCell.font = { bold: true, size: 16 };

        //////////////////////////////////////////////////
        const cashAndLedgerCell = worksheet.getCell("A33");
        cashAndLedgerCell.value = "Cashbook and Ledger Posting";
        cashAndLedgerCell.alignment = {
          vertical: "bottom",
          horizontal: "center",
        };
        cashAndLedgerCell.font = { bold: true, size: 16 };

        //////////////////////////////////////////////////
        const chartOfAccountCell = worksheet.getCell("E33");
        chartOfAccountCell.value = "Chart of Account";
        chartOfAccountCell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        chartOfAccountCell.font = { bold: true, size: 14 };
        const chartOfAccountValue = worksheet.getCell("E34");
        chartOfAccountValue.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        chartOfAccountValue.value = data.chartOfAccount;

        //////////////////////////////////////////////////
        const chartOfAccountCodeCell = worksheet.getCell("I33");
        chartOfAccountCodeCell.value = "Chart of Account Code ";
        chartOfAccountCodeCell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        chartOfAccountCodeCell.font = { bold: true, size: 14 };

        const chartOfAccountCodeValue = worksheet.getCell("I34");
        chartOfAccountCodeValue.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        chartOfAccountCodeValue.value = data.chartOfAccountCode;

        //////////////////////////////////////////////////
        const projBudgetLineCell = worksheet.getCell("M33");
        projBudgetLineCell.value = `Proj. Budget Line`;
        projBudgetLineCell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        projBudgetLineCell.font = { bold: true, size: 14 };

        const projBudgetLineValue = worksheet.getCell("M34");
        projBudgetLineValue.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        projBudgetLineValue.value = data.projBudgetLine;

        //////////////////////////////////////////////////
        const noteCell = worksheet.getCell("P33");
        noteCell.value = `Note`;
        noteCell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        noteCell.font = { bold: true, size: 14 };
        const noteCellValue = worksheet.getCell("P34");
        noteCellValue.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        noteCellValue.value = data.note;

        //////////////////////////////////////////////////
        const mandateReferenceCell = worksheet.getCell("T33");
        mandateReferenceCell.value = `Mandate Reference`;
        mandateReferenceCell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        mandateReferenceCell.font = { bold: true, size: 14 };
        const mandateReferenceValue = worksheet.getCell("T34");
        mandateReferenceValue.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        mandateReferenceValue.value = data.mandateReference;

        /////////////////////////////////////////////////////
        //FOOTER DATA
        /////////////////////////////////////////////////////
        const certifyCell = worksheet.getCell("J37");
        certifyCell.value = "I CERTIFY THAT";
        certifyCell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        certifyCell.font = { bold: true, size: 16 };

        //////////////////////////////////////////////////////
        const footerDescCell = worksheet.getCell("A38");
        footerDescCell.value =
          "The above payment is correct as to rate, authority and standing regulations";
        footerDescCell.font = { bold: false, size: 14 };

        //////////////////////////////////////////////////////
        const opVoucherCell = worksheet.getCell("A41");
        opVoucherCell.value = "Officer who prepared this Voucher:";
        opVoucherCell.font = { bold: true, size: 14 };

        //////////////////////////////////////////////////////
        const opNameCell = worksheet.getCell("G41");
        opNameCell.value = "Name(in Block Letters):";
        opNameCell.font = { bold: true, size: 14 };
        const opNameValue = worksheet.getCell("J41");
        opNameValue.value = data.preparedBy?.toUpperCase();
        opNameValue.border = { bottom: { style: "medium" } };

        ////////////////////////////////////////////////////
        const opSignatureCell = worksheet.getCell("O41");
        opSignatureCell.value = "signature:";
        opSignatureCell.alignment = {
          vertical: "middle",
          horizontal: "right",
        };
        opSignatureCell.font = { bold: true, size: 14 };
        const opSignatureValue = worksheet.getCell("Q41");
        opSignatureValue.border = { bottom: { style: "medium" } };

        ////////////////////////////////////////////////////

        const opDateCell = worksheet.getCell("T41");
        opDateCell.value = "Date:";
        opDateCell.alignment = {
          vertical: "middle",
          horizontal: "right",
        };
        opDateCell.font = { bold: true, size: 14 };
        const opDateValue = worksheet.getCell("U41");
        opDateValue.border = { bottom: { style: "medium" } };
        ////////////////////////////////////////////////////////////
        const ocVoucherCell = worksheet.getCell("A43");
        ocVoucherCell.value = "Officer who checked this Voucher:";
        ocVoucherCell.font = { bold: true, size: 14 };

        //////////////////////////////////////////////////////
        const ocNameCell = worksheet.getCell("G43");
        ocNameCell.value = "Name(in Block Letters):";
        ocNameCell.font = { bold: true, size: 14 };
        const ocNameValue = worksheet.getCell("J43");
        ocNameValue.value = data.checkedBy?.toUpperCase();
        ocNameValue.border = { bottom: { style: "medium" } };

        ////////////////////////////////////////////////////
        const ocSignature = worksheet.getCell("O43");
        ocSignature.value = "signature:";
        ocSignature.alignment = {
          vertical: "middle",
          horizontal: "right",
        };
        ocSignature.font = { bold: true, size: 14 };

        const ocSignatureValue = worksheet.getCell("Q43");
        ocSignatureValue.border = { bottom: { style: "medium" } };

        ////////////////////////////////////////////////////
        const ocDateCell = worksheet.getCell("T43");
        ocDateCell.value = "Date:";
        ocDateCell.alignment = {
          vertical: "middle",
          horizontal: "right",
        };
        ocDateCell.font = { bold: true, size: 14 };
        const ocDateValue = worksheet.getCell("U43");
        ocDateValue.border = { bottom: { style: "medium" } };

        /////////////////////////////////////////////////
        const clarificationCell = worksheet.getCell("A45");
        clarificationCell.value = "CLARIFICATION";
        clarificationCell.font = { bold: true, size: 16 };

        const clarificationValue = worksheet.getCell("A46");
        clarificationValue.value =
          "I certify that the services/goods have been fully satisfactory rendered/supplied, the price charged are fair and reasonable and the amount has been entered in my Vote Book";
        clarificationValue.font = { bold: false, size: 14 };

        //////////////////////////////////////////////////////
        const clNameCell = worksheet.getCell("A49");
        clNameCell.value = "Name:";
        clNameCell.font = { bold: true, size: 14 };
        const clNameValue = worksheet.getCell("B49");
        clNameValue.border = { bottom: { style: "medium" } };

        //////////////////////////////////////////////////////
        const clTitleCell = worksheet.getCell("H49");
        clTitleCell.value = "Title:";
        clTitleCell.font = { bold: true, size: 14 };
        clTitleCell.alignment = {
          vertical: "middle",
          horizontal: "right",
        };
        const clTitleValue = worksheet.getCell("I49");
        clTitleValue.border = { bottom: { style: "medium" } };

        //////////////////////////////////////////////////////
        const clSignatureCell = worksheet.getCell("N49");
        clSignatureCell.value = "signature:";
        clSignatureCell.alignment = {
          vertical: "middle",
          horizontal: "right",
        };
        clSignatureCell.font = { bold: true, size: 14 };
        const clSignatureValue = worksheet.getCell("P49");
        clSignatureValue.border = { bottom: { style: "medium" } };

        //////////////////////////////////////////////////////
        const clDateCell = worksheet.getCell("T49");
        clDateCell.value = "Date:";
        clDateCell.alignment = {
          vertical: "middle",
          horizontal: "right",
        };
        clDateCell.font = { bold: true, size: 14 };
        const clDateValue = worksheet.getCell("U49");
        clDateValue.border = { bottom: { style: "medium" } };
        //////////////////////////////////////////////////////
        //TABLE BORDER
        /////////////////////////////////////////////////////
        //TABLE 1 BORDER
        worksheet.getRow(28).eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
          };
        });
        worksheet.getRow(29).eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
          };
        });
        worksheet.getRow(30).eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
          };
        });

        //TABLE 2 BORDER
        worksheet.getRow(32).eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
          };
        });
        worksheet.getRow(33).eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
          };
        });
        worksheet.getRow(34).eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
          };
        });

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
          document.body.removeChild(link);
          // put alert showing file downloaded succesfully
          // handle loading state
        }
      }
    } catch (err) {
      console.log(err);
    }

    ///////////////////////////////////
    //RESET STATE
    ///////////////////////////////////
    setIsDownloading(false);

    setGrossAmount(0);
    setVat(0);
    setWht(0);
    setDeductions(0);
    setNetAmount(0);
    setDevLevy(0);
    setPvNumber("");
    setGrantCode("");
    reset();
    alert("File downloaded successfully");
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
            value={pvNumber}
            placeholder=""
            id="pvNumber"
            readOnly
            {...register("pvNumber")}
            // {...register("pvNumber", {
            //   required: "This field is required",
            // })}
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
          <Input
            type="date"
            id="date"
            {...register("date")}
            onChange={handleDate}
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
            onChange={handleGrantCode}
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
            step=".1"
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
            step=".1"
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
            step=".1"
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
            step=".1"
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
            type="number"
            value={netAmount}
            id="netAmount"
            readOnly
            {...register("netAmount")}
          />
        </FormRow>

        <FormRow
          label="Chart of Account Categories*"
          type="medium"
          error={errors?.chartOfAccountCategories?.message}
        >
          <Select
            id="chartOfAccountCategories"
            type="gray"
            options={categories}
            value={catOption}
            {...register("chartOfAccountCategories")}
            onChange={handleChartOfAccCat}
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
            options={dataFilter}
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

      <Button size="medium" disabled={isDownloading}>
        Download
      </Button>
    </Form>
  );
}

export default PaymentVoucherForm;
