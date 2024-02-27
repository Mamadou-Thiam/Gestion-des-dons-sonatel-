import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { DataCampagne } from "../../model/Campagne.model";
import { fetchCampagnes } from "../../services/CampagneService";

const size = "large";

// Définition du composant fonctionnel React CampagneList
const Campagne: React.FC = () => {
  // Déclaration des états du composant
  const [data, setData] = useState<DataCampagne[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchValue, _] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sort: { col: "id", type: "desc" },
    filter: "",
  });

  // Fonction pour supprimer un campagne en fonction de son ID
  const handleDeleteCampagne = (id: number) => {
    axios
      .delete(
        `https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/campagnes/${id}`
      )
      .then(() => {
        message.success("campagne supprimé avec succes!");
        loadData();
      })
      .catch((err) => console.log(err));
  };
  const loadData = useCallback(async () => {
    setLoading(true);
    const result = await fetchCampagnes(
      pagination.page,
      pagination.size,
      pagination.filter
    );
    setData(result.data);
    setTotalItems(result.total);
    console.log("donnee", result);
    setLoading(false);
  }, [pagination, searchValue]);

  // Effet secondaire pour charger les données des campagnes lors du rendu initial
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Fonction pour gérer la recherche de campagne par libelle
  const handleSearch = (value: string) => {
    setPagination((prev) => ({ ...prev, page: 0, filter: value }));
  };

  const handlePagination = (newPagination: TablePaginationConfig, _, sort) => {
    setPagination((prev) => ({
      ...prev,
      page: newPagination.current - 1,
      size: newPagination.pageSize,
      sort: sort.field
        ? { col: sort.field, type: sort.order === "ascend" ? "asc" : "desc" }
        : prev.sort,
    }));
  };

  // Définition des colonnes du tableau
  // Colonnes de la table des campagnes
  const columns = [
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
    },
    {
      title: "Libelle",
      dataIndex: "libelle",
      key: "libelle",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },

    {
      title: "Banniere",
      dataIndex: "banniere",
      key: "banniere",
    },
    {
      title: "Date Debut",
      dataIndex: "dateDebut",
      key: "dateDebut",
    },
    {
      title: "Date Fin",
      dataIndex: "dateFin",
      key: "dateFin",
    },
    {
      title: "Montant Cible",
      dataIndex: "montantCible",
      key: "montantCible",
    },
    {
      title: "Montant Actuel",
      dataIndex: "montantActuel",
      key: "montantActuel",
    },
    {
      title: "Nombre Don",
      dataIndex: "nombreDon",
      key: "nombreDon",
    },
    // {
    //   title: "Date Creation",
    //   dataIndex: "dateCreation",
    //   key: "dateCreation",
    // },
    // {
    //   title: "Date Modification",
    //   dataIndex: "dateModification",
    //   key: "dateModification",
    // },
    {
      title: "Montant Don Fixe",
      dataIndex: "montantDonFixe",
      key: "montantDonFixe",
    },

    {
      title: "Montant Kit",
      dataIndex: "montantKit",
      key: "montantKit",
    },

    {
      title: "Actions",
      dataIndex: "Actions",
      key: "Actions",
      render: (text: any, record: any) => (
        <>
          <Space size="small">
            <Link
              to={`/update/campagne/${record.key}`}
              className="btn btn-outline-info btn-lg btn-block"
            >
              <EditOutlined style={{color:"#FF7900"}} />
            </Link>

            <Button
              type="link"
              style={{ color: "red" }}
              onClick={() => handleDeleteCampagne(record.key)}
            >
              <DeleteOutlined />
            </Button>
          </Space>
        </>
      ),
    },
  ];

  // Utilisation de useMemo pour optimiser le rendu du tableau en cas de changement de données filtrées
  const dataSource = useMemo(() => {
    return data?.map((item, index) => ({
      key: item.id,
      index: index + 1,
      libelle: item.libelle,
      reference: item.reference,
      description: item.description,
      banniere: item.banniere,
      dateDebut: item.dateDebut,
      dateFin: item.dateFin,
      montantCible: item.montantCible,
      montantActuel: item.montantActuel,
      nombreDon: item.nombreDon,
      // dateCreation: item.dateCreation,
      // dateModification: item.dateModification,
      montantKit: item.montantKit,
      montantDonFixe: item.montantDonFixe,
    }));
  }, [data]);

  return (
    <>
      <div style={{ marginRight: "20px" }}>
        <div>
          <h1>Campagnes</h1>
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
                href="/addCampagne"
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
              placeholder="Rechercher par Libellé"
              suffix={<SearchOutlined />}
              style={{
                borderRadius: "0px",
              }}
              size={size}
              value={pagination.filter}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Affichage du tableau des campagnes */}
        <div style={{ marginTop: "20px" }}>
          <Table
            loading={loading}
            onChange={handlePagination}
            columns={columns}
            className="custom-row-hover"
            scroll={{ x: "scroll" }}
            bordered={true}
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

export default Campagne;
