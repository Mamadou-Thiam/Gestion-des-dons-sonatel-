import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Input,
  Space,
  TablePaginationConfig,
  message,
  Popconfirm,
} from "antd";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  DownOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import DataGroupe from "../../model/Groupe.model";
import { fetchGroupes } from "../../services/GroupeService";
import { exportToExcel } from "../../services/exportToExcel";

const size = "large";

const GroupeList: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<DataGroupe[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sort: { col: "dateCreation", type: "desc" },
    filter: "",
  });

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
      title: "libelle",
      dataIndex: "libelle",
      key: "libelle",
      width:150,
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
      width: 150,
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
      render: (text: any, record: any) => (
        <Space>
          <Link to={`/addGroupe/${record.key}`}>
            <Button
              type="link"
              style={{ color: "#FF7900" }}
              size={size}
              icon={<EditOutlined />}
            />
          </Link>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce groupe ?"
            onConfirm={() => handleDeleteGroupe(record.key)}
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
      ninea: item.ninea,
      codeMarchand: item.codeMarchand,
      rccm: item.rccm,
      numeroTelephone: item.numeroTelephone,
      logo: item.logo,
      tag: item.tag,
      dateCreation: item.dateCreation,
      dateModification: item.dateModification,
      typeGroupe: item.typeGroupe,
    }));
  }, [data]);

  const handleAddGroupe = () => {
    navigate("/addgroupe");
  };

  return (
    <>
      <div style={{ marginRight: "20px" }}>
        <h1 className="text-3xl font-bold my-3"> Groupes</h1>
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
              style={{
                background: "black",
                color: "white",
                margin: "0 10px",
                borderRadius: "0px",
              }}
              icon={<PlusOutlined />}
              size={size}
              onClick={handleAddGroupe}
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
              onClick={() => exportToExcel(dataSource)}
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
