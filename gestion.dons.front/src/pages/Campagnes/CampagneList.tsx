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
import { DataCampagne } from "../../model/Campagne.model";
import { fetchCampagnes } from "../../services/CampagneService";

const size = "large";

const CampagneList: React.FC = () => {
  const [data, setData] = useState<DataCampagne[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sort: { col: "dateCreation", type: "desc" },
    filter: "",
  });

  const handleDeleteCampagne = (id: number) => {
    axios
      .delete(`/campagnes/${id}`)
      .then(() => {
        message.success("Campagne supprimée avec succès !");
        loadData();
      })
      .catch((err) => {
        console.log(err);
        message.error(
          "Une erreur s'est produite lors de la suppression de la campagne."
        );
      });
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchCampagnes(
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

  const handleConfirmDelete = (id: number) => {
    handleDeleteCampagne(id);
  };

  const handleCancelDelete = () => {
    message.info("Suppression annulée");
  };

  const columns = [
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      sorter: true,
    },
    {
      title: "Libelle",
      dataIndex: "libelle",
      key: "libelle",
      sorter: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: true,
    },
    {
      title: "Banniere",
      dataIndex: "banniere",
      key: "banniere",
      sorter: true,
    },
    {
      title: "Date Debut",
      dataIndex: "dateDebut",
      key: "dateDebut",
      sorter: true,
    },
    {
      title: "Date Fin",
      dataIndex: "dateFin",
      key: "dateFin",
      sorter: true,
    },
    {
      title: "Montant Cible",
      dataIndex: "montantCible",
      key: "montantCible",
      sorter: true,
    },
    {
      title: "Montant Actuel",
      dataIndex: "montantActuel",
      key: "montantActuel",
      sorter: true,
    },
    {
      title: "Nombre Don",
      dataIndex: "nombreDon",
      key: "nombreDon",
      sort: true,
      sorter: true,
    },
    {
      title: "Montant Don Fixe",
      dataIndex: "montantDonFixe",
      key: "montantDonFixe",
      sorter: true,
    },
    {
      title: "Montant Kit",
      dataIndex: "montantKit",
      key: "montantKit",
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) => (
        <Space size="small">
          <Link to={`/addCampagne/${record.key}`}>
            <EditOutlined style={{ color: "#FF7900" }} />
          </Link>
          <Popconfirm
            title="Voulez-vous vraiment supprimer cette campagne ?"
            onConfirm={() => handleConfirmDelete(record.key)}
            onCancel={handleCancelDelete}
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

  const dataSource = useMemo(() => {
    return data?.map((item, index) => ({
      key: item.id,
      index: index + 1,
      reference: item.reference,
      libelle: item.libelle,
      description: item.description,
      banniere: item.banniere,
      dateDebut: item.dateDebut,
      dateFin: item.dateFin,
      montantCible: item.montantCible,
      montantActuel: item.montantActuel,
      nombreDon: item.nombreDon,
      montantDonFixe: item.montantDonFixe,
      montantKit: item.montantKit,
    }));
  }, [data]);

  return (
    <>
      <div style={{ marginRight: "20px" }}>
        <h1 className="text-3xl font-bold my-3"> Campagnes</h1>
        <div className="flex justify-between gap-3">
          <Input
            placeholder="Rechercher par libellé"
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
              href="/addCampagne"
              size={size}
            >
              Nouveau
            </Button>
          </div>
        </div>
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

export default CampagneList;
