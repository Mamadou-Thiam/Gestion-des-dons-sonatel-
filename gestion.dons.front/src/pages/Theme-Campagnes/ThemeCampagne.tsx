import React, { useEffect, useMemo, useState } from "react";
import { SizeType } from "antd/es/config-provider/SizeContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { Table, Button, Input, Form, Modal, Flex, message, Space } from "antd";
import {
  SaveOutlined,
  DownOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import DataThemeCampagne from "../../model/theme-campagne.model";
import { fetchThemeCampagnes } from "../../services/ThemeCampagneService";

const ThemeCampagne: React.FC = () => {
  const [form] = Form.useForm();
  const [formLayout] = useState<Parameters<typeof Form>[0]["layout"]>("inline");
  const [size] = useState<SizeType>("large");
  const [data, setData] = useState<DataThemeCampagne[]>([]);
  const [libelle, setLibelle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sort: { col: "id", type: "desc" },
    filter: "",
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleDeleteTheme = (id: number) => {
    axios
      .delete(
        `https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/theme-campagnes/${id}`
      )
      .then(() => {
        const updatedData = data.filter((item) => parseInt(item.id, 10) !== id);
        setData(updatedData);
        message.success("Thème de campagne supprimé avec succès !");
      })
      .catch((err) => {
        console.log(err);
        message.error("Erreur lors de la suppression du thème !");
      });
  };

  const handleCancel = () => {
    form.resetFields();
  };

  const handleSaveThemeCampagne = () => {
    form
      .validateFields()
      .then(() => {
        const data = { libelle, description };

        axios
          .post(
            "https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/theme-campagnes",
            data
          )
          .then(() => {
            message.success("Thème ajouté avec succès !");
            loadData();
            handleCancel();
            setIsModalVisible(false);
          })
          .catch((err) => {
            console.log(err);
            message.error("Erreur lors de l'ajout du thème campagne !");
          });
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchThemeCampagnes(
        pagination.page,
        pagination.size,
        pagination.filter
      );
      setData(result.data);
      setTotalItems(result.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pagination, searchValue]);

  const handleSearch = (value: string) => {
    setPagination((prev) => ({ ...prev, page: 0, filter: value }));
  };

  const handlePagination = (newPagination: any, _, sort: any) => {
    setPagination((prev) => ({
      ...prev,
      page: newPagination.current - 1,
      size: newPagination.pageSize,
      sort: sort.field
        ? { col: sort.field, type: sort.order === "ascend" ? "asc" : "desc" }
        : prev.sort,
    }));
  };

  const content = (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Form
        form={form}
        layout={formLayout}
        style={{ border: "none", width: "100%" }}
        size="large"
      >
        <Form.Item
          label="Libelle"
          style={{ width: "100%", marginBottom: "16px" }}
          labelCol={{ span: 4 }}
          name="libelle"
        >
          <Input
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            style={{ width: "100%", borderRadius: "0" }}
          />
        </Form.Item>
        <Form.Item
          label="Description"
          style={{ width: "100%", marginBottom: "16px" }}
          labelCol={{ span: 4 }}
          name="description"
          rules={[
            {
              required: true,
              message: "Veuillez renseigner le champ description",
            },
          ]}
        >
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", borderRadius: "0" }}
          />
        </Form.Item>
      </Form>
    </div>
  );

  const columns = [
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
      title: "Actions",
      dataIndex: "Actions",
      key: "Actions",
      render: (text: any, record: any) => (
        <>
          <Space size="small">
            <Link
              to={`/update/themeCampagne/${record.key}`}
              className="btn btn-outline-info btn-lg btn-block"
            >
              <EditOutlined style={{ color: "#FF7900" }} />
            </Link>
            <Button
              type="link"
              style={{ color: "red" }}
              onClick={() => handleDeleteTheme(record.key)}
            >
              <DeleteOutlined />
            </Button>
          </Space>
        </>
      ),
    },
  ];

  const dataSource = useMemo(() => {
    return data?.map((item, index) => ({
      key: item.id,
      index: index + 1,
      libelle: item.libelle,
      description: item.description,
    }));
  }, [data]);

  return (
    <>
      <div style={{ marginRight: "20px" }}>
        <div>
          <h1>Thème campagnes</h1>
        </div>

        <div style={{ display: "flex" }}>
          <div style={{ display: "flex" }}>
            <Flex gap="Large" wrap="wrap">
              <Button
                style={{
                  backgroundColor: "black",
                  color: "white",
                  margin: "0 10px",
                  borderRadius: "0px",
                }}
                icon={<PlusOutlined />}
                size={size}
                onClick={handleOpenModal}
              >
                Nouveau
              </Button>
              <Modal
                title="Formulaire d'ajout d'un Theme Campagne"
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={[
                  <div style={{ marginRight: "30%" }}>
                    <Button
                      key="cancel"
                      onClick={handleCloseModal}
                      style={{
                        borderRadius: "0px",
                        background: "#FF7900",
                        color: "white",
                      }}
                      icon={<CloseOutlined />}
                      size="large"
                    >
                      Annuler
                    </Button>
                    ,
                    <Button
                      key="save"
                      type="primary"
                      onClick={handleSaveThemeCampagne}
                      style={{ borderRadius: "0px", backgroundColor: "black" }}
                      icon={<SaveOutlined />}
                      size="large"
                    >
                      Enregistrer
                    </Button>
                    ,
                  </div>,
                ]}
                width={800}
                centered
              >
                {content}
              </Modal>
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
          <div style={{ marginLeft: "660px" }}>
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

        <div style={{ marginTop: "20px" }}>
          <Table
            loading={loading}
            columns={columns}
            scroll={{ x: "scroll" }}
            dataSource={dataSource}
            onChange={handlePagination}
            bordered
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

export default ThemeCampagne;
