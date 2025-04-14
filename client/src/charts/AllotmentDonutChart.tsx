import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface AllotmentStats {
  courses: Array<{
    id: string;
    name: string;
    code: string;
    studentCount: number;
  }>;
  courseBuckets: Array<{
    id: string;
    name: string;
    studentCount: number;
  }>;
  unallottedStudents: number;
}

interface AllotmentDonutChartProps {
  stats: AllotmentStats;
}

const AllotmentDonutChart: React.FC<AllotmentDonutChartProps> = ({ stats }) => {
  const labels = [
    ...stats.courses.map((course) => course.name),
    ...stats.courseBuckets.map((bucket) => bucket.name),
    "Unallotted Students",
  ];

  const dataValues = [
    ...stats.courses.map((course) => course.studentCount),
    ...stats.courseBuckets.map((bucket) => bucket.studentCount),
    stats.unallottedStudents,
  ];

  const chartData = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#C9CBCF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#C9CBCF",
        ],
      },
    ],
  };

  const chartOptions: ChartOptions<"doughnut"> = {
    plugins: {
      legend: {
        position: "right", // Correctly typed as one of the allowed values
      },
    },
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
};

export default AllotmentDonutChart;
