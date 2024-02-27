import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchPatients } from "../../services/PatientService";
import {
  Table,
  Button,
  Input,
  Space,
  TablePaginationConfig,
  message,
} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  DownOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Flex } from "antd";
import { DataPatient } from "../../model/fiche-patient.model";

const size = "large";


const PatientList: React.FC = () => {
  // Déclaration des états du composant
  const [data, setData] = useState<DataPatient[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sort: { col: "id", type: "desc" },
    filter: "",
  });

  // Fonction pour supprimer un patient en fonction de son ID
  const handleDeletePatient = (id: number) => {
    axios
      .delete(
        `https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/fiche-patients/${id}`
      )
      .then(() => {
        message.success("Patient supprimé avec succès !");
        loadData();
      })
      .catch((err) => {
        console.log(err);
        message.error(
          "Une erreur s'est produite lors de la suppression du patient."
        );
      });
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchPatients(
        pagination.page,
        pagination.size,
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

  // Effet secondaire pour charger les données des patients lors du rendu initial
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Fonction pour gérer la recherche de patients par prénom
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

  // Définition des colonnes du tableau
  const columns = [
    {
      title: "Prénom",
      dataIndex: "prenom",
      key: "prenom",
    },
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
    },

    {
      title: "Adresse",
      dataIndex: "adresse",
      key: "adresse",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Maladie",
      dataIndex: "maladie",
      key: "maladie",
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
    },
    {
      title: "Numéro-Téléphone",
      dataIndex: "numeroTelephone",
      key: "numeroTelephone",
    },
    {
      title: "Numéro-Identification",
      dataIndex: "numeroIdentification",
      key: "numeroIdentification",
    },
    {
      title: "Type-Identification",
      dataIndex: "typeIdentification",
      key: "typeIdentification",
    },
    // {
    //   title: "Date Création",
    //   dataIndex: "dateCreation",
    //   key: "dateCreation",
    // },
    // {
    //   title: "Date Modification",
    //   dataIndex: "dateModification",
    //   key: "dateModification",
    // },
    {
      title: "Actions",
      key: "actions",
      // Définition des actions (boutons éditer et supprimer) dans la colonne "Actions"
      render: (text: any, record: any) => (
        <Space size="small">
          
          <Link to={`/update/patient/${record.key}`}>
            <EditOutlined  style={{color:"#FF7900"}}/>
          </Link>
          <Button
            type="link"
            style={{ color: "red" }}
            onClick={() => handleDeletePatient(record.key)}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  // Utilisation de useMemo pour optimiser le rendu du tableau en cas de changement de données filtrées
  const dataSource = useMemo(() => {
    return data?.map((item, index) => ({
      key: item.id,
      index: index + 1,
      prenom: item.prenom,
      nom: item.nom,
      adresse: item.adresse,
      age: item.age,
      maladie: item.maladie,
      details: item.details,
      numeroTelephone: item.numeroTelephone,
      numeroIdentification: item.numeroIdentification,
      typeIdentification: item.typeIdentification,
      // dateCreation:item.dateCreation,
      // dateModification:item.dateModification
    }));
  }, [data]);

  // Rendu du composant PatientList
  return (
    <>
      <div style={{ marginRight: "20px" }}>
        <div>
          <h1> Patients</h1>
        </div>

        {/* Barre d'outils avec des boutons Nouveau, Importer et Exporter */}
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex" }}>
            <Flex gap="Large" wrap="wrap">
              <Button
                style={{
                  background: "black",
                  color: "white",
                  margin: "0 10px",
                  borderRadius: "0px",
                }}
                icon={<PlusOutlined />}
                href="/addPatient"
                size={size}
              >
                Nouveau
              </Button>
            </Flex>

            <Flex gap="Large" wrap="wrap">
              <Button
                style={{
                  background: "#FF7900",
                  color: "white",
                  margin: "0 10px",
                  borderRadius: "0px",
                }}
                icon={<UploadOutlined />}
                size={size}
              >
                Importer
              </Button>
            </Flex>

            <Flex gap="large" wrap="wrap">
              <Button
                style={{
                  background: "green",
                  color: "white",
                  margin: "0 10px",
                  borderRadius: "0px",
                }}
                icon={<DownOutlined />}
                size={size}
              >
                Exporter
              </Button>
            </Flex>
          </div>

          {/* Barre de recherche avec un champ Input.Search */}
          <div style={{ marginLeft: "640px" }}>
            <Input
              placeholder="Rechercher par prénom"
              suffix={<SearchOutlined  />}
              style={{
                borderRadius: "0px",
              }}
              size={size}
              value={pagination.filter}
              onChange={(e) => handleSearch(e.target.value)}
            />
            
          </div>
        </div>

        {/* Affichage du tableau des patients */}
        <div style={{ marginTop: "20px" }}>
          <Table
            
            loading={loading}
            scroll={{ x: "scroll" }}
            bordered
            onChange={handlePagination}
            columns={columns}
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

// Exportation du composant PatientList
export default PatientList;
