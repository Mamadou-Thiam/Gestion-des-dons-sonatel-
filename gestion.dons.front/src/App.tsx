import React, { useEffect, useState } from "react";
import { Layout, Menu, Modal } from "antd";
import {
  AppstoreAddOutlined,
  TeamOutlined,
  UserOutlined,
  ContainerOutlined,
  AreaChartOutlined,
  CopyrightCircleOutlined,
  LogoutOutlined,
  PayCircleOutlined,
} from "@ant-design/icons";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import PatientList from "./pages/fiche-Patients/PatientList";
import Groupe from "./pages/Groupes/GroupeList";
import Dashboard from "./pages/dashboard/Dashboard";
import "./App.css";
import NotFound from "./pages/NotFound";
import axios from "axios";
import { API_URL } from "./core/Constants";
import PatientForm from "./pages/fiche-Patients/PatientForm";
import GroupeForm from "./pages/Groupes/GroupeForm";
import CampagneForm from "./pages/Campagnes/CampagneForm";
import {
  getKeycloakToken,
  getUserToken,
  isTokenExpired,
  logoutUser,
} from "./services/KeycloakService";
import ThemeCampagneList from "./pages/Theme-Campagnes/ThemeCampagneList";
import CategorieThemeList from "./pages/Categories-Theme/CategorieThemeList";
import Login from "./pages/Login";
import CampagneList from "./pages/Campagnes/CampagneList";
import DonList from "./pages/dons/DonList";
import DonForm from "./pages/dons/DonForm";

const { Header, Content, Sider } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  axios.defaults.baseURL = API_URL;

  useEffect(() => {
    if (!getUserToken()) {
      navigate("/");
    }
  }, []);

  const logout = () => {
    logoutUser();
    navigate("/");
    window.location.reload();
  };

  const confirmLogout = () => {
    Modal.confirm({
      title: "Confirmation",
      content: "Êtes-vous sûr de vouloir vous déconnecter ?",
      okText: "OK",
      onOk: logout,
      onCancel: () => {},
    });
  };

  const userToken = getUserToken();

  axios.interceptors.request.use(async (req) => {
    console.log("Calling axios", req.url);
    if (!req.url.startsWith("/tokens")) {
      const token = getUserToken();
      console.log(isTokenExpired(), token);
      if (token) {
        if (!isTokenExpired()) {
          req.headers.Authorization = "Bearer " + token;
        } else {
          const token = await getKeycloakToken();
          req.headers.Authorization = "Bearer " + token;
        }
      } else {
        logout();
      }
    }

    return req;
  });

  const items = [
    {
      key: "1",
      label: "Tableau de bord",
      icon: <AreaChartOutlined />,
      path: "/dashboard",
    },
    {
      key: "2",
      label: "Patients",
      icon: <UserOutlined />,
      path: "/patient",
    },
    {
      key: "3",
      label: "Thème Campagnes",
      icon: <ContainerOutlined />,
      path: "/themeCampagne",
    },
    {
      key: "4",
      label: "Groupes",
      icon: <TeamOutlined />,
      path: "/groupe",
    },
    {
      key: "5",
      label: " Catégorie Thèmes",
      icon: <AppstoreAddOutlined />,
      path: "/categorieTheme",
    },
    {
      key: "6",
      label: "Campagnes",
      icon: <CopyrightCircleOutlined />,
      path: "/campagne",
    },
    {
      key: "7",
      label: "Dons",
      icon: <PayCircleOutlined />,
      path: "/don",
    },
    {
      key: "8",
      label: "Déconnexion",
      icon: <LogoutOutlined />,
      onClick: confirmLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {userToken && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{
            overflow: "auto",
            height: "120vh",
            position: "fixed",
            backgroundColor: "#000000",
          }}
          className="custom-sider"
        >
          <div className="logo" style={{ backgroundColor: "#FF7900" }} />
          <Menu
            theme="dark"
            mode="vertical"
            style={{ backgroundColor: "#000000" }}
          >
            {items.map((item) => (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                onClick={item.onClick} // Ajout de la fonction de clic pour la déconnexion
                style={{ display: "flex", alignItems: "center" }}
              >
                <Link to={item.path}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
      )}
      <Layout
        style={{
          marginLeft: userToken ? (collapsed ? 80 : 200) : 0,
          transition: "margin-left 0.2s",
        }}
      >
        {userToken && (
          <Header
            style={{
              backgroundColor: "#FF7900",
              padding: 0,
              position: "fixed",
              width: "100%",
              zIndex: 3,
            }}
          >
            <div
              style={{ display: "flex", color: "white", marginLeft: "15px" }}
            >
              <h1 className="text-3xl flex justify-between gap-3 mt-4">
                Wesalo
              </h1>
            </div>
          </Header>
        )}
        <Content
          style={{
            padding: userToken ? 24 : 0,
            minHeight: userToken ? 800 : 0,
            backgroundColor: "white",
            overflow: "auto",
            marginTop: userToken ? "50px" : 0,
          }}
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/campagne" element={<CampagneList />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patient" element={<PatientList />} />
            <Route path="/themeCampagne" element={<ThemeCampagneList />} />
            <Route path="/addTheme" element={<ThemeCampagneList />} />
            <Route path="/groupe" element={<Groupe />} />
            <Route path="/addPatient" element={<PatientForm />} />
            <Route path="/addPatient/:id" element={<PatientForm />} />
            <Route path="/categorieTheme" element={<CategorieThemeList />} />
            <Route path="/addGroupe" element={<GroupeForm />} />
            <Route path="addGroupe/:id" element={<GroupeForm />} />
            <Route path="/addTheme/:id" element={<ThemeCampagneList />} />
            <Route path="/addCategorie" element={<CategorieThemeList />} />
            <Route path="addCategorie/:id" element={<CategorieThemeList />} />
            <Route path="/addCampagne" element={<CampagneForm />} />
            <Route path="/addCampagne/:id" element={<CampagneForm />} />
            <Route path="/don" element={<DonList />} />
            <Route path="/addDon" element={<DonForm />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
