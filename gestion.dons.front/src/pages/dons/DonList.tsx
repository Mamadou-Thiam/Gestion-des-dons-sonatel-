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

const DonList: React.FC = () => {
  const navigate=useNavigate()

  const handleAddDon = () => navigate("/addDon");

  const size = "large";
  const columns = [
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      sorter: true,
      width: 150,
    },
    {
      title: "Reference Transaction",
      dataIndex: "referenceTransaction",
      key: "referenceTransaction",
      sorter: true,
      width: 450,
    },
    {
      title: "Type Don",
      dataIndex: "typeDon",
      key: "typeDon",
      width: 250,
      sorter: true,
    },
    {
      title: "Banque",
      dataIndex: "banque",
      key: "banque",
      width: 250,
      sorter: true,
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      width: 250,
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
      fixed: "right" as const,
      width: 150,
      render: (text, record) => (
        <div style={{ display: "flex" }}>
          <Button
            type="link"
            size={size}
            style={{ color: "#FF7900" }}
            icon={<EditOutlined />}
            // onClick={() => handleEditPatient(record.id)}
          />

          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce patient ?"
            // onConfirm={() => handleDeletePatient(record.id)}
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

  return (
    <>
      <h1 className="text-3xl font-bold my-3">Dons</h1>
      <div className="flex justify-between gap-3">
        <Input
          size={size}
          placeholder="Rechercher par Reference Transaction"
          suffix={<SearchOutlined />}
          style={{ borderRadius: "0px" }}
        />
        <div className="flex gap-2">
          <Button
            size={size}
            style={{
              background: "black",
              color: "white",
              margin: "0 10px",
              borderRadius: "0px",
            }}
            icon={<PlusOutlined />}
            onClick={handleAddDon}
          >
            Faire un don
          </Button>
          <Button
            size={size}
            style={{
              background: "#FF7900",
              color: "white",
              margin: "0 10px",
              borderRadius: "0px",
            }}
            icon={<DownOutlined />}
            // onClick={exportToExcel}
          >
            Exporter
          </Button>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Table columns={columns} />
      </div>
    </>
  );
};

export default DonList;
