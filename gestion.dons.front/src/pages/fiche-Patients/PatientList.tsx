import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchPatients } from "../../services/PatientService";
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
import { DataPatient } from "../../model/fiche-patient.model";

const size = "large";

const PatientList: React.FC = () => {
  const [data, setData] = useState<DataPatient[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sort: { col: "dateCreation", type: "desc" },
    filter: "",
  });

  const handleDeletePatient = (id: string) => {
    const patientId = parseInt(id, 10); 
    axios
      .delete(`/fiche-patients/${patientId}`)
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

  const columns = [
    {
      title: "Prénom",
      dataIndex: "prenom",
      key: "prenom",
      sorter: true,
    },
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
      sorter: true,
    },
    {
      title: "Adresse",
      dataIndex: "adresse",
      key: "adresse",
      sorter: true,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: true,
    },
    {
      title: "Maladie",
      dataIndex: "maladie",
      key: "maladie",
      sorter: true,
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      sorter: true,
    },
    {
      title: "Numéro-Téléphone",
      dataIndex: "numeroTelephone",
      key: "numeroTelephone",
      sorter: true,
    },
    {
      title: "Numéro-Identification",
      dataIndex: "numeroIdentification",
      key: "numeroIdentification",
      sorter: true,
    },
    {
      title: "Type-Identification",
      dataIndex: "typeIdentification",
      key: "typeIdentification",
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: DataPatient) => (
        <Space size="small">
          <Link to={`/addpatient/${record.id}`}>
            <EditOutlined style={{ color: "#FF7900" }} />
          </Link>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce patient ?"
            onConfirm={() => handleDeletePatient (record.id)}
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
      id: item.id,
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
    }));
  }, [data]);

  return (
    <>
      <div style={{ marginRight: "20px" }}>
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
              className="text-white bg-black !rounded-none"
              icon={<PlusOutlined />}
              href="/addPatient"
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
      </div>
    </>
  );
};

export default PatientList;
