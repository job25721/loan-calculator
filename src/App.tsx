import {
  Button,
  Container,
  Divider,
  HStack,
  Input,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function App() {
  const [principal, setPrincipal] = useState<number>(0);
  const [installment, setInstallment] = useState<number>(0);
  const [mrr, setMrr] = useState<number>(0);

  const [installmentCount, setInstallmentCount] = useState<number>(0);
  const [totalInterestToPaid, setTotalInterestToPaid] = useState<number>(0);

  const [interestsHistory, setInterestsHistory] = useState<number[]>([]);
  const [installmentsHistory, setInstallmentsHistory] = useState<number[]>([]);

  const [extraInstallment, setExtraInstallment] = useState<number>(0);

  const installmentCalculate = () => {
    let count = 0;
    let remainPrincipal = principal;

    let totalInterestToPaid = 0;

    const interests = [];
    const installments = [];

    while (remainPrincipal > 0) {
      const interestPermonth = Math.floor(
        (remainPrincipal * (mrr / 100) * 30) / 365
      );
      totalInterestToPaid += interestPermonth;
      interests.push(interestPermonth);

      let installmentPermonth = installment - interestPermonth;
      if (count === 1 && extraInstallment > 0) {
        installmentPermonth += extraInstallment;
      }
      installments.push(installmentPermonth);

      remainPrincipal -= installmentPermonth;

      count++;
    }

    setInstallmentCount(count);
    setTotalInterestToPaid(totalInterestToPaid);

    setInterestsHistory(interests);
    setInstallmentsHistory(installments);
  };

  const convertMonthToYear = (month: number): string => {
    return `(${Math.floor(month / 12)} ปี ${month % 12} เดือน)`;
  };

  const labels = new Array(installmentCount).fill(0).map((_, i) => i + 1);

  const today = new Date();

  const endInstallmentDate = new Date(
    today.getFullYear(),
    today.getMonth() + installmentCount,
    today.getDate()
  ).toLocaleDateString("th-TH");

  return (
    <Container p={4} maxW="conatiner.xl">
      <Text fontSize="x-large">วางแผนผ่อนเงินกู้</Text>
      <Divider my={4} />
      <HStack alignItems="center" mb={4} flexWrap="wrap">
        <div>
          <label htmlFor="">MRR %</label>
          <Input type="number" onChange={(e) => setMrr(+e.target.value)} />
        </div>
        <div>
          <label htmlFor="">เงินต้น</label>
          <Input
            type="number"
            onChange={(e) => setPrincipal(+e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="">ยอดผ่อนต่อเดือน</label>
          <Input
            type="number"
            onChange={(e) => setInstallment(+e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="">โปะเพิ่ม</label>
          <Input
            type="number"
            onChange={(e) => setExtraInstallment(+e.target.value)}
          />
        </div>
      </HStack>
      <Button onClick={installmentCalculate}>คำนวณ</Button>
      <Divider my={4} />
      {installmentCount > 0 && (
        <>
          <Text fontSize="x-large">
            จำนวนงวดที่ต้องผ่อน: {installmentCount} งวด
            <br />
            คิดเป็นเวลา
            {convertMonthToYear(installmentCount)}
          </Text>
          <Text fontSize="x-large">
            จำนวนดอกเบี้ยที่ต้องจ่าย: {totalInterestToPaid}
          </Text>
          <Text color="red.500" fontSize="x-large">
            คุณจะหมดหนี้ในวันที่ {endInstallmentDate}
          </Text>
        </>
      )}

      <Line
        data={{
          labels,
          datasets: [
            {
              fill: true,
              label: "ดอกเบี้ย",
              data: interestsHistory,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
              fill: true,
              label: "ลดเงินต้น",
              data: installmentsHistory,
              borderColor: "rgb(54, 162, 235)",
              backgroundColor: "rgba(54, 162, 235, 0.5)",
            },
          ],
        }}
      />
    </Container>
  );
}

export default App;
