import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  TablePaginationConfig,
  message,
  Modal,
  Form,
  Popconfirm,
} from "antd";
import axios from "axios";
import {
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { DataCategorieTheme } from "../../model/categorie-theme.model";
import { fetchThemeCategorie } from "../../services/CategorieThemeService";

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
    axios
      .delete(`/categorie-themes/${id}`)
      .then(() => {
        message.success("Catégorie supprimée avec succès !");
        loadData();
      })
      .catch((err) => {
        console.log(err);
        message.error(
          "Une erreur s'est produite lors de la suppression de la catégorie."
        );
      });
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchThemeCategorie(
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
    setCategorie(record);
    setVisible(true);
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
      ? axios.put(`/categorie-themes/${categorie.id}`, data)
      : axios.post("/categorie-themes", data);

    promise
      .then((res) => {
        console.log(res);
        message.success("Catégorie enregistrée avec succès !");
        setVisible(false);
        loadData();
      })
      .catch((err) => {
        console.log(err);
        console.log("Error in Save!");
        message.error("Erreur lors de l'enregistrement de la catégorie.");
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
      title: "Actions",
      key: "actions",
      render: (text: any, record: DataCategorieTheme) => (
        <Space size="small">
          <Button type="link" onClick={() => handleEditCategorie(record)}>
            <EditOutlined style={{ color: "#FF7900" }} />
          </Button>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer cette catégorie ?"
            onConfirm={() => handleDeleteCategorie(Number(record.id))}
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
      libelle: item.libelle,
      description: item.description,
      id: item.id,
      supprime: item.supprime,
    }));
  }, [data]);

  return (
    <>
      <div style={{ marginRight: "20px" }}>
        <h1 className="text-3xl font-bold my-3">Catégories Themes</h1>
        <div className="flex justify-between gap-3">
          <Input
            placeholder="Rechercher par libellé"
            suffix={<SearchOutlined />}
            style={{ borderRadius: "0px" }}
            size={size}
            value={pagination.filter}
            className="flex-1"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              className="text-white bg-black !rounded-none "
              icon={<PlusOutlined />}
              onClick={() => {
                setCategorie(undefined);
                setVisible(true);
              }}
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
            columns={columns as any}
            dataSource={dataSource}
            pagination={{
              current: pagination.page + 1,
              pageSize: pagination.size,
              total: totalItems,
            }}
          />
        </div>
        <Modal
          title={categorie ? "Modifier la catégorie" : "Ajouter une catégorie"}
          visible={visible}
          onCancel={handleCancel}
          footer={null}
          centered
          width={700}
        >
          <Form
            
            layout="vertical"
            onFinish={handleSaveCategorie}
            initialValues={categorie}
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
            <div style={{ alignItems: "center", marginLeft: "220px" }}>
              <Button
                style={{
                  background: "#FF7900",
                  color: "white",
                  borderRadius: "0px",
                }}
                icon={<CloseOutlined />}
                size="large"
                onClick={handleCancel}
              >
                Annuler
              </Button>
              <Button
                style={{
                  background: "black",
                  color: "white",
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
