import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  TablePaginationConfig,
  message,
  Modal,
  Form,
  Popconfirm,
} from "antd";
import {
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { exportToExcel } from "../../services/exportToExcel";
import { DataCategorieTheme } from "../../model/categorie-theme.model";
import CategorieThemeService from "../../services/CategorieThemeService";

const size = "large";

const CategorieThemeList: React.FC = () => {
  const [data, setData] = useState<DataCategorieTheme[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sort: { col: "dateCreation", type: "desc" },
    filter: "",
  });
  const [visible, setVisible] = useState(false);
  const [categorie, setCategorie] = useState<DataCategorieTheme | undefined>();

  const handleDeleteCategorie = (id: number) => {
    CategorieThemeService.deleteCategorieTheme(id)
      .then(() => {
        message.success("categorie theme supprimé avec succès !");
        loadData();
      })
      .catch((err) => {
        console.log(err);
        message.error(
          "Une erreur s'est produite lors de la suppression du categorie theme."
        );
      });
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await CategorieThemeService.fetchCategorieTheme(
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

  const handleEditCategorie = (record: DataCategorieTheme) => {
    setVisible(true);
    setCategorie(record);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSaveCategorie = (values: any) => {
    const data = {
      id: categorie?.id,
      ...categorie,
      ...values,
    };

    const promise = categorie
      ? CategorieThemeService.updateCategorieTheme(categorie.id, data)
      : CategorieThemeService.createCategorieTheme(data);

    promise
      .then((res) => {
        console.log(res);

        message.success("categorie enregistré avec succès !");
        loadData();
        setVisible(false);
      })
      .catch((err) => {
        console.log(err);
        console.log("Error in Save!");
        message.error("Erreur lors de l'enregistrement du categorie.");
      });
  };

  const columns = [
    {
      title: "Libellé",
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
      title: "Date Création",
      dataIndex: "dateCreation",
      key: "dateModification",
      sorter: true,
    },
    {
      title: "Date Modification",
      dataIndex: "dateModification",
      key: "dateModification",
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,

      render: (text: any, record: DataCategorieTheme) => (
        <div className="flex">
          <Button type="link" onClick={() => handleEditCategorie(record)}>
            <EditOutlined style={{ color: "#FF7900" }} />
          </Button>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce thème ?"
            onConfirm={() => handleDeleteCategorie(Number(record.id))}
            okText="Oui"
            cancelText="Non"
            okButtonProps={{ style: { color: "white", background: "#66BB6A" } }}
            cancelButtonProps={{
              style: { color: "white", background: "#FF7900" },
            }}
          >
            <Button type="link" style={{ color: "red" }}>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginRight: "20px" }}>
        <h1 className="text-3xl font-bold my-3">Catégorie Thèmes</h1>
        <div className="flex justify-between gap-3">
          <Input
            placeholder="Rechercher par libelle"
            suffix={<SearchOutlined />}
            style={{ borderRadius: "0px" }}
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
              onClick={() => {
                setVisible(true);
              }}
              size={size}
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
            scroll={{ x: "scroll" }}
            bordered
            onChange={handlePagination}
            columns={columns}
            dataSource={data}
            pagination={{
              current: pagination.page + 1,
              pageSize: pagination.size,
              total: totalItems,
            }}
          />
        </div>
        <Modal
          title={
            categorie
              ? "Formulaire de modification du Categorie theme"
              : "Formulaire d'ajout d'un categorie theme"
          }
          visible={visible}
          onCancel={handleCancel}
          footer={null}
          centered // Centre le contenu du modal
          width={700}
        >
          <Form
            layout="vertical"
            onFinish={handleSaveCategorie}
            autoComplete="off"
          >
            <Form.Item
              label="Libellé"
              name="libelle"
              rules={[
                { required: true, message: "Veuillez entrer le libellé" },
              ]}
            >
              <Input style={{ borderRadius: 0 }} />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea />
            </Form.Item>
            <div
              className="flex  gap-3"
              style={{ alignItems: "center", justifyContent: "flex-end" }}
            >
              <Button
                className="white-button"
                style={{
                  borderRadius: "0px",
                }}
                icon={<CloseOutlined />}
                size="large"
                onClick={handleCancel}
              >
                Annuler
              </Button>
              <Button
                className="button-orange"
                style={{
                  borderRadius: "0px",
                }}
                htmlType="submit"
                icon={<SaveOutlined />}
                size="large"
              >
                Enregistrer
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default CategorieThemeList;
