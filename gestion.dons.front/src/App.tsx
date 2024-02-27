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
import ThemeCampagne from "./pages/Theme-Campagnes/ThemeCampagne";
import AddPatient from "./pages/fiche-Patients/AddPatient";
import Groupe from "./pages/Groupes/Groupe";
import Dashboard from "./pages/dashboard/Dashboard";
import CategorieTheme from "./pages/Categories-Theme/CategorieTheme";
import AddGroupe from "./pages/Groupes/AddGroupe";
import Update from "./Actions/ThemeCampagne/Update";
import UpdateCategorie from "./Actions/ThemeCategories/UpdateCategorie";
import UpdateGroupe from "./Actions/Groupes/UpdateGroupe";
import UpdatePatient from "./Actions/FichePatients/UpdatePatient";
import "./App.css";
import Campagne from "./pages/Campagnes/Campagne";
import UpdateCampagne from "./Actions/Campagnes/UpdateCampagne";
import AddCampagne from "./pages/Campagnes/AddCampagne";
import NotFound from "./pages/NotFound";

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

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
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1 style={{ color: "white", margin: 0, marginLeft: "30px" }}>
              Wesalo Back Office
            </h1>
          </div>
        </Header>
        <Content
          style={{
            margin: "29px",
            padding: 24,
            minHeight: 600,
            backgroundColor: "white",
            overflow: "auto",
            marginTop: "50px",
          }}
        >
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patient" element={<PatientList />} />
            <Route path="/themeCampagne" element={<ThemeCampagne />} />
            <Route path="/groupe" element={<Groupe />} />
            <Route path="/addPatient" element={<AddPatient />} />
            <Route path="/categorieTheme" element={<CategorieTheme />} />
            <Route path="/addGroupe" element={<AddGroupe />} />
            <Route path="/campagne" element={<Campagne />} />
            <Route
              path="/update/patient/:id"
              element={<UpdatePatient />}
            />
            <Route
              path="/update/themeCampagne/:id"
              element={<Update />}
            />
            <Route
              path="/update/themeCategorie/:id"
              element={<UpdateCategorie />}
            />
            <Route path="/update/groupe/:id" element={<UpdateGroupe />} />
            <Route path="/addCampagne" element={<AddCampagne />} />
            <Route
              path="/update/campagne/:id"
              element={<UpdateCampagne />}
            />
            <Route path="*" element={<NotFound/>}/>
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
