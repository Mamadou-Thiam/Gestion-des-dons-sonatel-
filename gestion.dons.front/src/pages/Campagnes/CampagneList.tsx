import React, { useCallback, useEffect, useState } from "react";
import { Switch } from "antd";
import {
  Table,
  Button,
  Input,
  TablePaginationConfig,
  message,
  Popconfirm,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { DataCampagne } from "../../model/Campagne.model";
import CampagneService from "../../services/CampagneService";
import { exportToExcel } from "../../services/exportToExcel";

const size = "large";

const CampagneList: React.FC = () => {
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
      const result = await CampagneService.fetchCampagnes(
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
    CampagneService.deleteCampagne(id)
      .then(() => {
        message.success("campagne supprimé avec succes!");
        loadData();
      })
      .catch((err) => {
        message.error(
          "une erreur s'est produite lors de la suppression du campagne"
        );
      });
  };

  const handleCancelDelete = () => {
    message.info("Suppression annulée");
  };

  const handleActivateCampagne = async (id: number) => {
    try {
      await CampagneService.activateCampagne(id);
      message.success("Campagne activée avec succès !");
      loadData();
    } catch (error) {
      console.error("Erreur lors de l'activation de la campagne :", error);
      message.error("Une erreur s'est produite lors de l'activation.");
    }
  };

  const handleDeactivateCampagne = async (id: number) => {
    try {
      await CampagneService.deactivateCampagne(id);
      message.success("Campagne désactivée avec succès !");
      loadData();
    } catch (error) {
      console.error("Erreur lors de la désactivation de la campagne :", error);
      message.error("Une erreur s'est produite lors de la désactivation.");
    }
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
      title: "Libelle",
      dataIndex: "libelle",
      key: "libelle",
      width: 150,
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
      title: "Banniere",
      dataIndex: "banniere",
      key: "banniere",
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
    {
      title: "Montant Cible",
      dataIndex: "montantCible",
      key: "montantCible",
      width: 150,
      sorter: true,
    },
    {
      title: "Montant Actuel",
      dataIndex: "montantActuel",
      key: "montantActuel",
      width: 150,
      sorter: true,
    },
    {
      title: "Nombre Don",
      dataIndex: "nombreDon",
      key: "nombreDon",
      width: 150,
      sorter: true,
    },
    {
      title: "Montant Don Fixe",
      dataIndex: "montantDonFixe",
      key: "montantDonFixe",
      width: 150,
      sorter: true,
    },
    {
      title: "Montant Kit",
      dataIndex: "montantKit",
      key: "montantKit",
      width: 150,
      sorter: true,
    },
    {
      title: "Groupe",
      dataIndex: ["groupe", "libelle"],
      key: "groupe",
      width: 150,
      sorter: true,

      render: (text, record) => <span>{record.groupe.libelle}</span>,
    },
    {
      title: "Theme",
      dataIndex: ["theme", "libelle"],
      key: "theme",
      width: 150,
      sorter: true,

      render: (text, record) => <span>{record.theme.libelle}</span>,
    },
    {
      title: "Date Creation",
      dataIndex: "dateCreation",
      key: "dateCreation",
      width: 150,
      sorter: true,
    },
    {
      title: "Date Modification",
      dataIndex: "dateModification",
      key: "dateModification",
      width: 150,
      sorter: true,
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      width: 150,
      render: (statut: string, record: any) => (
        <span>
          {record.active ? (
            <>
              <span className="blue-circle mr-2"></span>
              <span>Actif </span>
            </>
          ) : (
            <div>
              <span className="red-circle mr-2"></span>
              <span>Inactif </span>
            </div>
          )}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      fixed: "right",
      render: (text: any, record: any) => (
        <div>
          <Link to={`/addCampagne/${record.id}`}>
            <Button
              type="link"
              style={{ color: "#FF7900" }}
              icon={<EditOutlined />}
              size={size}
            />
          </Link>
          <Popconfirm
            title="Voulez-vous vraiment supprimer cette campagne ?"
            onConfirm={() => handleConfirmDelete(record.id)}
            onCancel={handleCancelDelete}
            okText="Oui"
            cancelText="Non"
            okButtonProps={{
              style: { color: "white", background: "#66BB6A" },
            }}
            cancelButtonProps={{
              style: { color: "white", background: "#FF7900" },
            }}
          >
            <Button
              type="link"
              style={{ color: "red" }}
              icon={<DeleteOutlined />}
              size={size}
            />
          </Popconfirm>
          <Switch
            checked={record.active}
            onChange={(checked) => {
              if (checked) {
                handleActivateCampagne(record.id);
              } else {
                handleDeactivateCampagne(record.id);
              }
            }}
            checkedChildren="Actif "
            unCheckedChildren="Inactif"
          />
        </div>
      ),
    },
  ];

  const handleAddCampagne = () => {
    navigate("/addCampagne");
  };

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
              style={{
                borderRadius: "0px",
              }}
              className="white-button"
              icon={<PlusOutlined />}
              size={size}
              onClick={handleAddCampagne}
            >
              Nouveau
            </Button>
            <Button
              style={{
                borderRadius: "0px",
              }}
              className="button-orange"
              icon={<DownOutlined />}
              size={size}
              onClick={() => exportToExcel(data)}
            >
              Exporter
            </Button>
          </div>
        </div>
        <div style={{ marginTop: "20px" }}>
          <Table
            loading={loading}
            scroll={{ x: 1300 }}
            bordered
            onChange={handlePagination}
            columns={columns as any}
            dataSource={data}
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
