import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  TablePaginationConfig,
  message,
} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  DownOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined
} from "@ant-design/icons";
import { Flex } from "antd";
import DataGroupe from "../../model/Groupe.model";
import { fetchGroupes } from "../../services/GroupeService";

const size = "large";

const Groupe: React.FC = () => {
  const [data, setData] = useState<DataGroupe[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sort: { col: "id", type: "desc" },
    filter: "",
  });

  const handleDeleteGroupe = (id: number) => {
    axios
      .delete(
        `https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/groupes/${id}`
      )
      .then(() => {
        message.success("Groupe supprimé avec succès !");
        loadData();
      })
      .catch((err) => {
        console.log(err);
        message.error("Erreur lors de la suppression du groupe !");
      });
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    const result = await fetchGroupes(
      pagination.page,
      pagination.size,
      pagination.filter
    );
    setData(result.data);
    setTotalItems(result.total);
    setLoading(false);
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
      page: newPagination.current - 1,
      size: newPagination.pageSize,
      sort: sort.field
        ? { col: sort.field, type: sort.order === "ascend" ? "asc" : "desc" }
        : prev.sort,
    }));
  };

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
      title: "Type-Groupe",
      dataIndex: "typeGroupe",
      key: "typeGroupe",
    },
    {
      title: "Ninea",
      dataIndex: "ninea",
      key: "ninea",
    },
    {
      title: "Code-Marchand",
      dataIndex: "codeMarchand",
      key: "codeMarchand",
    },
    {
      title: "Rccm",
      dataIndex: "rccm",
      key: "rccm",
    },
   
    {
      title: "Numero-Telephone",
      dataIndex: "numeroTelephone",
      key: "numeroTelephone",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) => (
        <Space size="small">
          <Link to={`/update/groupe/${record.key}`}>
            <EditOutlined style={{"color":"#FF7900"}}/>
          </Link>
          <Button
            type="link"
            style={{ color: "red" }}
            onClick={() => handleDeleteGroupe(record.key)}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = useMemo(() => {
    return data?.map((item, index) => ({
      key: item.id,
      index: index + 1,
      description: item.description,
      libelle: item.libelle,
      ninea: item.ninea,
      rccm: item.rccm,
      codeMarchand: item.codeMarchand,
      numeroTelephone: item.numeroTelephone,
      typeGroupe:item.typeGroupe

    }));
  }, [data]);

  return (
    <>
      <div style={{ marginRight: "20px" }}>
        <div>
          <h1>Groupes</h1>
        </div>

        <div style={{ display: "flex" }}>
          <div style={{ display: "flex" }}>
            <Flex gap="Large" wrap="wrap">
              <Button
                style={{
                  background: "black",
                  color: "white",
                  margin: "0 10px",
                  borderRadius: "0px",
                }}
                icon={<PlusOutlined />}
                href="/addGroupe"
                size={size}
              >
                Nouveau
              </Button>
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
              suffix={<SearchOutlined  />}
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

export default Groupe;
