import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  AppstoreAddOutlined,
  TeamOutlined,
  UserOutlined,
  ContainerOutlined,
  AreaChartOutlined,
  CopyrightCircleOutlined,
} from "@ant-design/icons";
import { Routes, Route, Link } from "react-router-dom";
import PatientList from "./pages/fiche-Patients/PatientList";
import Groupe from "./pages/Groupes/GroupeList";
import Dashboard from "./pages/dashboard/Dashboard";
import "./App.css";
import Campagne from "./pages/Campagnes/CampagneList";
import NotFound from "./pages/NotFound";
import axios from "axios";
import { API_URL, KEYCLOACK_URL } from "./core/Constants";
import PatientForm from "./pages/fiche-Patients/PatientForm";
import GroupeForm from "./pages/Groupes/GroupeForm";
import CampagneForm from "./pages/Campagnes/CampagneForm";
import { getKeycloakToken } from "./services/KeycloakService";
import ThemeCampagneList from "./pages/Theme-Campagnes/ThemeCampagneList";
import CategorieThemeList from "./pages/Categories-Theme/CategorieThemeList";

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  axios.defaults.baseURL = API_URL;

  axios.interceptors.request.use(async (req) => {
    console.log("Calling axios", req.url);
    if (!req.url.startsWith("/tokens")) {
      const token = await getKeycloakToken();
      if (token) {
        req.headers.Authorization = "Bearer " + token;
      }
    }

    return req;
  });

  const items = [
    {
      key: "1",
      label: "Tableau de bord",
      icon: <AreaChartOutlined />,
      path: "/",
    },
    {
      key: "2",
      label: "Patients",
      icon: <UserOutlined />,
      path: "/patient",
    },
    {
      key: "3",
      label: "Theme Campagnes",
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
      label: " Categorie Thèmes",
      icon: <AppstoreAddOutlined />,
      path: "/categorieTheme",
    },
    {
      key: "6",
      label: "Campagnes",
      icon: <CopyrightCircleOutlined />,
      path: "/Campagne",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: "auto",
          height: "100vh",
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
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "margin-left 0.2s",
        }}
      >
        <Header
          style={{
            backgroundColor: "#FF7900",
            padding: 0,
            position: "fixed",
            width: "100%",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex" }}>
            <h1
              className="text-3xl font-bold my-3,"
              style={{
                color: "white",
                margin: 0,
                marginLeft: "30px",
                marginTop: "10px",
                alignItems: "center",
              }}
            >
              Wesalo Back Office
            </h1>
          </div>
        </Header>
        <Content
          style={{
            margin: "29px",
            padding: 24,
            minHeight: 800,
            backgroundColor: "white",
            overflow: "auto",
            marginTop: "50px",
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patient" element={<PatientList />} />
            <Route path="/themeCampagne" element={<ThemeCampagneList />} />
            <Route path="/addTheme" element={<ThemeCampagneList />} />
            <Route path="/groupe" element={<Groupe />} />
            <Route path="/addPatient" element={<PatientForm />} />
            <Route path="/addPatient/:id" element={<PatientForm />} />

            <Route path="/categorieTheme" element={<CategorieThemeList />} />
            <Route path="/addGroupe" element={<GroupeForm />} />
            <Route path="addGroupe/:id" element={<GroupeForm />} />
            <Route path="/campagne" element={<Campagne />} />
            <Route path="/addTheme/:id" element={<ThemeCampagneList />} />
            <Route path="/addCategorie" element={<CategorieThemeList />} />
            <Route path="addCategorie/:id" element={<CategorieThemeList />} />

            <Route path="/addCampagne" element={<CampagneForm />} />
            <Route path="/addCampagne/:id" element={<CampagneForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Content>

        <Footer
          style={{
            textAlign: "center",
            position: "fixed",
            width: "100%",
            bottom: 0,
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
