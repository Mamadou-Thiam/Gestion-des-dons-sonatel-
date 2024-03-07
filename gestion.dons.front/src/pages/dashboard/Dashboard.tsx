import React, { useEffect, useState, useCallback } from "react";
import { Card, Row, Col, Typography, Statistic } from "antd";
import "../dashboard/Dashboard.css";
import {
  UserOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
  ContainerOutlined,
  CopyrightCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [patientCount, setPatientCount] = useState<number>(0);
  const [categorieCount, setCategorieCount] = useState<number>(0);
  const [groupeCount, setGroupeCount] = useState<number>(0);
  const [campagneCount, setCampagneCount] = useState<number>(0);
  const [countCampagne, setCountCampagne] = useState<number>(0);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const initChart = useCallback(() => {
    const existingChart = Chart.getChart("myChart");
    if (existingChart) {
      existingChart.destroy();
    }

    const ctx = document.getElementById("myChart") as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: [
          "Patients",
          "Catégories",
          "Groupes",
          "Thèmes Campagnes",
          "Campagnes",
        ],
        datasets: [
          {
            label: "Nombre",
            data: [
              patientCount,
              categorieCount,
              groupeCount,
              campagneCount,
              countCampagne,
            ],
            backgroundColor: [
              "#FFCA28",
              "#3949AB",
              "#4CAF50",
              "#9575CD",
              "#FF5252",
            ],
            borderColor: "#fff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "right",
          },
        },
      },
    });
  }, [patientCount, categorieCount, groupeCount, campagneCount, countCampagne]);

  const initBarChart = useCallback(() => {
    const existingBarChart = Chart.getChart("myBarChart");
    if (existingBarChart) {
      existingBarChart.destroy();
    }

    const ctx = document.getElementById("myBarChart") as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Patients",
          "Catégories",
          "Groupes",
          "Thèmes Campagnes",
          "Campagnes",
        ],
        datasets: [
          {
            label: "Nombre",
            data: [
              patientCount,
              categorieCount,
              groupeCount,
              campagneCount,
              countCampagne,
            ],
            backgroundColor: [
              "#FFCA28",
              "#3949AB",
              "#4CAF50",
              "#9575CD",
              "#FF5252",
            ],
            borderColor: "#fff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [patientCount, categorieCount, groupeCount, campagneCount, countCampagne]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ficheResponse = await axios.get(
          "/fiche-patients/count?supprime.equals=false"
        );
        setPatientCount(ficheResponse.data);

        const categorieResponse = await axios.get(
          "/categorie-themes/count?supprime.equals=false"
        );
        setCategorieCount(categorieResponse.data);

        const groupeResponse = await axios.get(
          "/groupes/count?supprime.equals=false"
        );
        setGroupeCount(groupeResponse.data);

        const campagneResponse = await axios.get(
          "/theme-campagnes/count?supprime.equals=false"
        );
        setCampagneCount(campagneResponse.data);

        const CampagneResponse = await axios.get(
          "/campagnes/count?supprime.equals=false"
        );
        setCountCampagne(CampagneResponse.data);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      initChart();
      initBarChart();
    }
  }, [dataLoaded, initChart, initBarChart]);

  return (
    <>
      <Title level={2}>Dashboard</Title>

      <Row gutter={[16, 16]} justify="center">
        <Col span={4}>
          <Link to="/patient">
            <Card bordered={false} className="dashboard-card">
              <Statistic
                title="Patients"
                value={patientCount}
                valueStyle={{ color: "#FFCA28" }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Link>
        </Col>

        <Col span={4}>
          <Link to="/themeCampagne">
            <Card bordered={false} className="dashboard-card">
              <Statistic
                title="Thème Campagnes"
                value={campagneCount}
                valueStyle={{ color: "#3949AB" }}
                prefix={<ContainerOutlined />}
              />
            </Card>
          </Link>
        </Col>
        <Col span={4}>
          <Link to="/groupe">
            <Card bordered={false} className="dashboard-card">
              <Statistic
                title="Groupes"
                value={groupeCount}
                valueStyle={{ color: "#4CAF50" }}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Link>
        </Col>
        <Col span={4}>
          <Link to="categorieTheme">
            <Card bordered={false} className="dashboard-card">
              <Statistic
                title="Catégorie Thèmes"
                value={categorieCount}
                valueStyle={{ color: "#9575CD" }}
                prefix={<AppstoreAddOutlined />}
              />
            </Card>
          </Link>
        </Col>
        <Col span={4}>
          <Link to="campagne">
            <Card bordered={false} className="dashboard-card">
              <Statistic
                title="Campagnes"
                value={countCampagne}
                valueStyle={{ color: "#FF5252" }}
                prefix={<CopyrightCircleOutlined />}
              />
            </Card>
          </Link>
        </Col>
      </Row>

      <Row
        gutter={16}
        justify="start"
        style={{ marginTop: "30px", alignItems: "center" }}
      >
        <Col span={12}>
          <div className="canvas-container">
            <canvas id="myChart"></canvas>
          </div>
        </Col>
        <Col span={12}>
          <div className="canvas-container">
            <canvas id="myBarChart"></canvas>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
