  import React, { useCallback, useEffect, useMemo, useState } from "react";
  import { Table, Button, Input, message, Popconfirm } from "antd";
  import { useNavigate } from "react-router-dom";
  import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
    DownOutlined,
  } from "@ant-design/icons";
  import { exportToExcel } from "../../services/exportToExcel";
  import PatientService from "../../services/PatientService";

  const size = "large";

  const PatientList = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);

    const [pagination, setPagination] = useState({
      page: 0,
      size: 10,
      sort: { col: "dateCreation", type: "desc" },
      filter: "",
    });

    const handleDeletePatient = (id) => {
      PatientService.deletePatient(id)
        .then(() => {
          message.success("Patient supprimé avec succès !");
          loadData();
        })
        .catch((err) => {
          console.error(err);
          message.error(
            "Une erreur s'est produite lors de la suppression du patient."
          );
        });
    };

    const loadData = useCallback(async () => {
      setLoading(true);
      try {
        const result = await PatientService.fetchPatients(
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

    const handleEditPatient = (id) => {
      navigate(`/addpatient/${id}`);
    };

    const columns: any[] = [
      {
        title: "Prénom",
        dataIndex: "prenom",
        key: "prenom",
        width: 150,
        sorter: true,
      },
      {
        title: "Nom",
        dataIndex: "nom",
        key: "nom",
        width: 150,
        sorter: true,
      },
      {
        title: "Adresse",
        dataIndex: "adresse",
        key: "adresse",
        width: 150,
        sorter: true,
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
        width: 150,
        sorter: true,
      },
      {
        title: "Maladie",
        dataIndex: "maladie",
        key: "maladie",
        width: 150,
        sorter: true,
      },
      {
        title: "Details",
        dataIndex: "details",
        key: "details",
        width: 150,
        sorter: true,
      },
      {
        title: "Numero Telephone",
        dataIndex: "numeroTelephone",
        key: "numeroTelephone",
        width: 150,
        sorter: true,
      },
      {
        title: "Numero Identification",
        dataIndex: "numeroIdentification",
        key: "numeroIdentification",
        width: 200,
        sorter: true,
      },
      {
        title: "type Identification",
        dataIndex: "typeIdentification",
        key: "typeIdentification",
        width: 200,
        sorter: true,
      },
      {
        title: "Date Création",
        dataIndex: "dateCreation",
        key: "dateCreation",
        width: 200,
        sorter: true,
      },
      {
        title: "Date Modification",
        dataIndex: "dateModification",
        key: "dateModification",
        width: 200,
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
              onClick={() => handleEditPatient(record.id)}
            />
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce patient ?"
              onConfirm={() => handleDeletePatient(record.id)}
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

    const handleAddPatient = () => {
      navigate("/addpatient");
    };

    return (
      <>
        <h1 className="text-3xl font-bold my-3">Patients</h1>
        <div className="flex justify-between gap-3">
          <Input
            placeholder="Rechercher par prénom"
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
                background: "black",
                color: "white",
                margin: "0 10px",
                borderRadius: "0px",
              }}
              icon={<PlusOutlined />}
              size={size}
              onClick={handleAddPatient}
            >
              Nouveau
            </Button>
            <Button
              style={{
                background: "#FF7900",
                color: "white",
                margin: "0 10px",
                borderRadius: "0px",
              }}
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
            rowKey={(r) => r.id}
            pagination={{
              current: pagination.page + 1,
              pageSize: pagination.size,
              total: totalItems,
            }}
          />
        </div>
      </>
    );
  };

  export default PatientList;
