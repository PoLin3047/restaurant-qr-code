import axios from "axios";
import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";

function Customer_history() {
  const [allData, setAllData] = useState([]);
  const [customer_count, setCustomer_count] = useState([]);
  const [allDate, setAllDate] = useState([]);
  const [onlyDate, setOnlyDate] = useState([]);
  const [sum, setSum] = useState(0);

  const now = new Date();
  const [selectMonth, setSelectMonth] = useState(now.getMonth() + 1);
  const [selectYear, setSelectYear] = useState(now.getFullYear());

  async function getCustomer_history() {
    try {
      const response = await axios.get(
        `http://localhost:3000/dashboard/customer_history_chart`,
        {
          params: {
            month: selectMonth,
            year: selectYear,
          },
        }
      );
      // Update state
      setAllData(response.data);
      setAllDate(response.data.map((ad) => ad.date));
      setCustomer_count(response.data.map((ad) => ad.total_customers));
      setOnlyDate(response.data.map((ad) => ad.date.split("-")[2]));
      let totalSum = 0;
      response.data.forEach((ad) => {
        totalSum += Number(ad.total_customers);
      });
      setSum(totalSum); 
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    getCustomer_history();
    const intervalGetCustomer_history = setInterval(() => {
      getCustomer_history();
    }, 10 * 1000);

    return () => clearInterval(intervalGetCustomer_history);
  }, [selectMonth, selectYear]);

  return (
    <div>
      <div>
        <MonthSelect
          selectMonth={selectMonth}
          setSelectMonth={setSelectMonth}
        />
        <YearSelect selectYear={selectYear} setSelectYear={setSelectYear} />
      </div>
      <p>รวม {sum} คน </p>
      <LineChart
        xAxis={[
          {
            label: "วันที่",
            data: [0, ...onlyDate],
            scaleType: "linear",
          },
        ]}
        yAxis={[{ label: "ยอดลูกค้า" }]}
        series={[
          {
            label: `เดือน ${selectMonth} ปี ${selectYear + 543}`,
            data: [0, ...customer_count],
          },
        ]}
        barLabel="value"
        height={400}
      />
    </div>
  );
}

function YearSelect({ selectYear, setSelectYear }) {
  const d = new Date();
  let year = d.getFullYear();
  const years = [];
  for (let index = year; index >= year - 3; index--) {
    years.push(index);
  }

  return (
    <>
      <label htmlFor="select_year">ปี</label>
      <select
        name="select_year"
        id="select_year"
        className="ms-3 border rounded p-2"
        value={selectYear}
        onChange={(e) => setSelectYear(Number(e.target.value))}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year + 543}
          </option>
        ))}
      </select>
    </>
  );
}

function MonthSelect({ selectMonth, setSelectMonth }) {
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  return (
    <>
      <label htmlFor="select_month">เดือน</label>
      <select
        value={selectMonth}
        onChange={(e) => setSelectMonth(Number(e.target.value))}>
        {months.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </>
  );
}

export default Customer_history;
