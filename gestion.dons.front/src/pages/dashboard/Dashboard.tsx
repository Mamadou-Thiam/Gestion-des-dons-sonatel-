import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Input,
  TablePaginationConfig,
} from "antd";
import "../dashboard/Dashboard.css";
import {
  UserOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
  ContainerOutlined,
  CopyrightCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import { DataCampagne } from "../../model/Campagne.model";
import {
  fetchActiveCampagnes,
} from "../../services/CampagneService";
// import { use } from "i18next";
const Dashboard: React.FC = () => {
  const size = "large";
  const [patientCount, setPatientCount] = useState<number>(0);
  const [categorieCount, setCategorieCount] = useState<number>(0);
  const [groupeCount, setGroupeCount] = useState<number>(0);
  const [campagneCount, setCampagneCount] = useState<number>(0);
  const [countCampagne, setCountCampagne] = useState<number>(0);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const navigate = useNavigate();
  const [data, setData] = useState<DataCampagne[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sort: { col: "dateCreation", type: "desc" },
    filter: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchActiveCampagnes(
        pagination.page,
        pagination.size,
        pagination.sort,
        pagination.filter
      );
      setData(result.data);
      setTotalItems(result.total);
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors du chargement des données :",
        error
      );
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = (value: string) => {
    setPagination((prev) => ({ ...prev, page: 0, filter: value }));
  };

  const handlePagination = (newPagination: TablePaginationConfig, _, sort) => {
    setPagination((prev) => ({
      ...prev,
      page: newPagination.current ? newPagination.current - 1 : 0,
      size: newPagination.pageSize || 10,
      sort: sort.field
        ? { col: sort.field, type: sort.order === "ascend" ? "asc" : "desc" }
        : prev.sort,
    }));
  };

  const columns = [
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      width: 120,

      sorter: true,
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 150,

      sorter: true,
    },

    {
      title: "Date Debut",
      dataIndex: "dateDebut",
      key: "dateDebut",
      width: 150,

      sorter: true,
    },
    {
      title: "Date Fin",
      dataIndex: "dateFin",
      key: "dateFin",
      width: 150,

      sorter: true,
    },
  ];

  const dataSource = useMemo(() => {
    return data?.map((item, index) => ({
      key: item.id,
      index: index + 1,
      reference: item.reference,

      description: item.description,
      dateDebut: item.dateDebut,
      dateFin: item.dateFin,
      active: item.active,
    }));
  }, [data]);

  const initBarChart = useCallback(() => {
    const existingBarChart = Chart.getChart("myBarChart");
    if (existingBarChart) {
      existingBarChart.destroy();
    }

    const ctx = document.getElementById("myBarChart") as HTMLCanvasElement;
    if (!ctx) return;

    // ctx.width = 2600;
    // ctx.height = 3000;

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
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            display: false,
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
      // initChart();
      initBarChart();
    }
  }, [dataLoaded, initBarChart]);

  return (
    <>
      <div>
        <Col span={6} style={{ marginTop: "6%" }}>
          <div className="canvas-container">
            <canvas id="myBarChart"></canvas>
          </div>
        </Col>
        <Row gutter={[16, 16]} justify="center" style={{ marginTop: "40px" }}>
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
            <Link to="/categorieTheme">
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
            <Link to="/campagne">
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
      </div>
      <div style={{ marginRight: "20px", marginTop: "50px" }}>
        <h1 className="text-3xl font-bold my-3">Liste des Campagnes actives</h1>
        <div className="flex justify-between gap-3">
          <Input
            placeholder="Rechercher par Description"
            suffix={<SearchOutlined />}
            style={{
              borderRadius: "0px",
            }}
            size={size}
            value={pagination.filter}
            className="flex-1"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <Table
            loading={loading}
            scroll={{ x: 1300 }}
            bordered
            onChange={handlePagination}
            columns={columns as any}
            dataSource={dataSource}
            pagination={{
              current: pagination.page + 1,
              pageSize: pagination.size,
              total: totalItems,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
