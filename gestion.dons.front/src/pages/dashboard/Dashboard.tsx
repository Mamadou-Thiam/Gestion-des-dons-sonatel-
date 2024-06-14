import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Card,
  Space,
  Statistic,
  Row,
  Col,
  TablePaginationConfig,
  Table,
  Input,
} from "antd";
import Chart from "chart.js/auto";
import {
  TeamOutlined,
  UserOutlined,
  ContainerOutlined,
  AppstoreAddOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "../dashboard/Dashboard.css";
import { DataCampagne } from "../../model/Campagne.model";
import { fetchActiveCampagnes } from "../../services/ActiveCampagneService";

function Dashboard() {
  const [familles, setFamilles] = useState(0);
  const [mineurs, setMineurs] = useState(0);
  const [livrables, setLivrables] = useState(0);
  const [livrableMins, setLivrableMins] = useState(0);
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
  const size = "large";

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
          "Catégories Thèmes",
          "Groupes",
          "Thèmes Campagnes",
        ],
        datasets: [
          {
            label: "Nombre",
            data: [familles, mineurs, livrables, livrableMins],
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: "right",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [familles, mineurs, livrables, livrableMins]);

  const initDoughnutChart = useCallback(() => {
    const existingDoughnutChart = Chart.getChart("myDoughnutChart");
    if (existingDoughnutChart) {
      existingDoughnutChart.destroy();
    }

    const ctx = document.getElementById("myDoughnutChart") as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [
          "Patients",
          "Catégories Thèmes",
          "Groupes",
          "Thèmes Campagnes",
        ],
        datasets: [
          {
            label: "Nombre",
            data: [familles, mineurs, livrables, livrableMins],
            backgroundColor: ["#FFCA28", "#3949AB", "#4CAF50", "#9575CD"],
            borderColor: "#fff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: "right",
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
  }, [familles, mineurs, livrables, livrableMins]);

  useEffect(() => {
    initBarChart();
    initDoughnutChart();
  }, [initBarChart, initDoughnutChart]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const familleResponse = await axios.get(
          "/fiche-patients/count?supprime.equals=false"
        );
        setFamilles(familleResponse.data);

        const mineurResponse = await axios.get(
          "/categorie-themes/count?supprime.equals=false"
        );
        setMineurs(mineurResponse.data);

        const livrableResponse = await axios.get(
          "/groupes/count?supprime.equals=false"
        );
        setLivrables(livrableResponse.data);

        const livrableMinResponse = await axios.get(
          "/theme-campagnes/count?supprime.equals=false"
        );
        setLivrableMins(livrableMinResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Space size={20} direction="vertical" style={{ width: "100%" }}>
      <h1 className="text-3xl font-bold my-3">Dashboard</h1>
      <Row gutter={[32, 32]}>
        <Col xs={24} md={12} lg={8}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Link to="/patient">
                <DashboardCard
                  icon={
                    <UserOutlined
                      style={{
                        color: "red",
                        backgroundColor: "rgba(255,0,0,0.25)",
                        borderRadius: 20,
                        fontSize: 24,
                        padding: 8,
                      }}
                    />
                  }
                  title={"Patients"}
                  value={familles}
                />
              </Link>
            </Col>
            <Col span={24}>
              <Link to="/categorieTheme">
                <DashboardCard
                  icon={
                    <AppstoreAddOutlined
                      style={{
                        color: "purple",
                        backgroundColor: "rgba(0,255,255,0.25)",
                        borderRadius: 20,
                        fontSize: 24,
                        padding: 8,
                      }}
                    />
                  }
                  title={"Catégories Thèmes"}
                  value={mineurs}
                />
              </Link>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Link to="/groupe">
                <DashboardCard
                  icon={
                    <TeamOutlined
                      style={{
                        color: "green",
                        backgroundColor: "rgba(0,255,0,0.25)",
                        borderRadius: 20,
                        fontSize: 24,
                        padding: 8,
                      }}
                    />
                  }
                  title={"Groupes"}
                  value={livrables}
                />
              </Link>
            </Col>
            <Col span={24}>
              <Link to="/themeCampagne">
                <DashboardCard
                  icon={
                    <ContainerOutlined
                      style={{
                        color: "blue",
                        backgroundColor: "rgba(0,0,255,0.25)",
                        borderRadius: 20,
                        fontSize: 24,
                        padding: 8,
                      }}
                    />
                  }
                  title={"Thèmes Campagnes"}
                  value={livrableMins}
                />
              </Link>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={6} lg={8}>
          <Card
            style={{
              maxHeight: "328px",
              height: "auto",
              marginTop: "8px",
            }}
          >
            <canvas id="myDoughnutChart"></canvas>
          </Card>
        </Col>
      </Row>
      <div style={{ marginRight: "20px", marginTop: "10px" }}>
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
    </Space>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <Card
      className="dashboard"
      style={{
        width: "100%",
        height: 150,
        margin: 8,
        padding: 10,
      }}
    >
      <Space direction="horizontal">
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}

export default Dashboard;
