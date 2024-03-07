import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  TablePaginationConfig,
  message,
  Popconfirm,
} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import DataGroupe from "../../model/Groupe.model";
import { fetchGroupes } from "../../services/GroupeService";

const size = "large";

const GroupeList: React.FC = () => {
  // Déclaration des états du composant
  const [data, setData] = useState<DataGroupe[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sort: { col: "dateCreation", type: "desc" },
    filter: "",
  });

  // Fonction pour supprimer un patient en fonction de son ID
  const handleDeleteGroupe = (id: number) => {
    axios
      .delete(`/groupes/${id}`)
      .then(() => {
        message.success("Groupe supprimé avec succès !");
        loadData();
      })
      .catch((err) => {
        console.log(err);
        message.error(
          "Une erreur s'est produite lors de la suppression du groupe."
        );
      });
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchGroupes(
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
      title: "libelle",
      dataIndex: "libelle",
      key: "libelle",
      sorter: true,
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
      sorter: true,
    },

    {
      title: "ninea",
      dataIndex: "ninea",
      key: "ninea",
      sorter: true,
    },
    {
      title: "codeMarchand",
      dataIndex: "codeMarchand",
      key: "codeMarchand",
      sorter: true,
    },
    {
      title: "rccm",
      dataIndex: "rccm",
      key: "rccm",
      sorter: true,
    },
    {
      title: "numeroTelephone",
      dataIndex: "numeroTelephone",
      key: "numeroTelephone",
      sorter: true,
    },
    {
      title: "typeGroupe",
      dataIndex: "typeGroupe",
      key: "typeGroupe",
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      // Définition des actions (boutons éditer et supprimer) dans la colonne "Actions"
      render: (text: any, record: any) => (
        <Space>
         <Link to={`/addGroupe/${record.key}`}>
            <EditOutlined style={{ color: "#FF7900" }} />
          </Link>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce groupe ?"
            onConfirm={() => handleDeleteGroupe(record.key)}
            okText="Oui"
            cancelText="Non"
          >
            <Button type="link" style={{ color: "red" }}>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
         
      
      ),
    },
    
  ];

  // Utilisation de useMemo pour optimiser le rendu du tableau en cas de changement de données filtrées
  const dataSource = useMemo(() => {
    return data?.map((item, index) => ({
      key: item.id,
      index: index + 1,
      libelle: item.libelle,
      description: item.description,
      ninea: item.ninea,
      codeMarchand: item.codeMarchand,
      rccm: item.rccm,
      numeroTelephone: item.numeroTelephone,
      typeGroupe: item.typeGroupe,
    }));
  }, [data]);

  // Rendu du composant PatientList
  return (
    <>
      <div style={{ marginRight: "20px" }}>
        <h1 className="text-3xl font-bold my-3"> Groupes</h1>

        {/* Barre d'outils avec des boutons Nouveau, Importer et Exporter */}
        <div className="flex justify-between gap-3">
          <Input
            placeholder="Rechercher par libelle"
            suffix={<SearchOutlined />}
            style={{
              borderRadius: "0px",
            }}
            size={size}
            value={pagination.filter}
            className="flex-1"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              className="text-white bg-black !rounded-none "
              icon={<PlusOutlined />}
              href="/addgroupe"
              size={size}
            >
              Nouveau
            </Button>
          </div>
        </div>

        {/* Affichage du tableau des groupes */}
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

export default GroupeList;
