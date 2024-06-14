import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Input, message, Popconfirm, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  DownOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { exportToExcel } from "../../services/exportToExcel";
import GroupeService from "../../services/GroupeService";

const size = "large";

const titleStyle = {
  color: "#0B5ED7",
};

const GroupeList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedGroupe, setSelectedGroupe] = useState(null);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sort: { col: "dateCreation", type: "desc" },
    filter: "",
  });

  const handleDeleteGroupe = (id) => {
    GroupeService.deleteGroupe(id)
      .then(() => {
        message.success("groupe supprimé avec succès !");
        loadData();
      })
      .catch((err) => {
        console.error(err);
        message.error(
          "Une erreur s'est produite lors de la suppression du groupe."
        );
      });
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await GroupeService.fetchGroupes(
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

  const handleSearch = (value) => {
    setPagination((prev) => ({ ...prev, page: 0, filter: value }));
  };

  const handlePagination = (newPagination, _, sort) => {
    setPagination((prev) => ({
      ...prev,
      page: newPagination.current ? newPagination.current - 1 : 0,
      size: newPagination.pageSize || 10,
      sort: sort.field
        ? { col: sort.field, type: sort.order === "ascend" ? "asc" : "desc" }
        : prev.sort,
    }));
  };
  const handleCancelDelete = () => {
    message.info("Suppression annulée");
  };

  const handleEditGroupe = (id) => {
    navigate(`/addGroupe/${id}`);
  };

  const handleViewGroupe = async (id) => {
    try {
      const groupe = await GroupeService.getGroupeById(id);
      setSelectedGroupe(groupe);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du groupe");
    }
  };

  const columns: any[] = [
    {
      title: "libelle",
      dataIndex: "libelle",
      key: "libelle",
      width: 150,
      sorter: true,
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
      width: 150,
      sorter: true,
    },

    {
      title: "ninea",
      dataIndex: "ninea",
      key: "ninea",
      width: 150,
      sorter: true,
    },
    {
      title: "codeMarchand",
      dataIndex: "codeMarchand",
      key: "codeMarchand",
      width: 150,
      sorter: true,
    },
    {
      title: "rccm",
      dataIndex: "rccm",
      key: "rccm",
      width: 150,
      sorter: true,
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      width: 150,
      sorter: true,
    },
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      width: 150,
      sorter: true,
    },
    {
      title: "numeroTelephone",
      dataIndex: "numeroTelephone",
      key: "numeroTelephone",
      width: 200,
      sorter: true,
    },
    {
      title: "typeGroupe",
      dataIndex: "typeGroupe",
      key: "typeGroupe",
      width: 150,
      sorter: true,
    },
    {
      title: "Date Création",
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
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (text, record) => (
        <div style={{ display: "flex" }}>
          <Button
            type="link"
            style={{ color: "#FF7900" }}
            size={size}
            icon={<EditOutlined />}
            onClick={() => handleEditGroupe(record.id)}
          />
          <Button type="link" onClick={() => handleViewGroupe(record.id)}>
            <EyeOutlined style={{ color: "black" }} />
          </Button>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce groupe ?"
            onConfirm={() => handleDeleteGroupe(record.id)}
            onCancel={handleCancelDelete}
            okText="Oui"
            cancelText="Non"
            okButtonProps={{ style: { color: "white", background: "#66BB6A" } }}
            cancelButtonProps={{
              style: { color: "white", background: "#FF7900" },
            }}
          >
            <Button
              type="link"
              style={{ color: "red" }}
              size={size}
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleAddGroupe = () => {
    navigate("/addGroupe");
  };

  return (
    <>
      <h1 className="text-3xl font-bold my-3">Groupes</h1>
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
            size={size}
            onClick={handleAddGroupe}
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
          columns={columns as any}
          dataSource={data}
          rowKey={(r) => r.id}
          pagination={{
            current: pagination.page + 1,
            pageSize: pagination.size,
            total: totalItems,
          }}
        />
      </div>
      <Modal
        title="Détails du groupe"
        visible={selectedGroupe !== null}
        onCancel={() => setSelectedGroupe(null)}
        footer={null}
        width={10000}
      >
        {selectedGroupe && (
          <Table
            dataSource={[selectedGroupe]}
            columns={[
              {
                title: <span style={titleStyle}> Libelle</span>,
                dataIndex: "libelle",
                key: "libelle",
                width: 150,
              },
              {
                title: <span style={titleStyle}>Description</span>,
                dataIndex: "description",
                key: "description",
                width: 150,
              },
              {
                title: <span style={titleStyle}>Ninea</span>,
                dataIndex: "ninea",
                key: "ninea",
                width: 150,
              },

              {
                title: <span style={titleStyle}>Code Marchand</span>,
                dataIndex: "codeMarchand",
                key: "age",
                width: 150,
              },
              {
                title: <span style={titleStyle}> Numero Telephone</span>,
                dataIndex: "numeroTelephone",
                key: "numeroTelephone",
                width: 150,
              },
              {
                title: <span style={titleStyle}> Type Groupe</span>,
                dataIndex: "typeGroupe",
                key: "typeGroupe",
                width: 150,
              },
              {
                title: <span style={titleStyle}>Tag</span>,
                dataIndex: "tag",
                key: "tag",
                width: 150,
              },
              {
                title: <span style={titleStyle}>Logo</span>,
                dataIndex: "logo",
                key: "logo",
                width: 200,
              },
              {
                title: <span style={titleStyle}>Date Creation</span>,
                dataIndex: "dateCreation",
                key: "dateCreation",
                width: 200,
              },
              {
                title: <span style={titleStyle}>Date Modification</span>,
                dataIndex: "dateModification",
                key: "dateModification",
                width: 200,
              },
            ]}
            bordered
            size="large"
            pagination={false}
          />
        )}
      </Modal>
    </>
  );
};

export default GroupeList;
